/**
 * @fileoverview Unit tests for FileTransferManager.
 * Tests security fixes and critical functionality.
 */

import { test, expect } from '@playwright/test';

test.describe('FileTransferManager Tests', () => {
  test.describe('Security: Chunk Validation (Fix 0.1)', () => {
    test('rejects chunks with negative index', async ({ page }) => {
      await page.goto('/index.html?noredirect');

      const result = await page.evaluate(async () => {
        const { createFileTransferManager } = await import('../src/managers/FileTransferManager.js');

        // Setup mocks
        const fileTransfersRef = { current: new Map() };
        const mockMessage = jest => jest;
        const manager = createFileTransferManager({
          fileChannelRef: { current: null },
          fileTransfersRef,
          fileSendTimestampsRef: { current: [] },
          fileReceiveTimestampsRef: { current: [] },
          fileInputRef: { current: null },
          appendMessage: mockMessage,
          appendSystemMessage: mockMessage,
          t: { fileShare: {} }
        });

        // Initialize a transfer
        const fileId = 'test-file-1';
        fileTransfersRef.current.set(fileId, {
          chunks: [],
          totalChunks: 10,
          receivedChunks: 0,
          mimeType: 'image/png',
          fileName: 'test.png',
          totalSize: 1000,
          category: 'image',
          direction: 'receive',
          aborted: false,
          progress: 0
        });

        // Simulate receiving a chunk with negative index
        const maliciousPayload = JSON.stringify({
          type: 'file-chunk',
          fileId: fileId,
          chunkIndex: -1,
          data: 'dGVzdA=='
        });

        manager.handleIncomingFileMessage(maliciousPayload);

        const transfer = fileTransfersRef.current.get(fileId);
        return {
          receivedChunks: transfer.receivedChunks,
          chunkAtNegativeIndex: transfer.chunks[-1]
        };
      });

      // Chunk should be rejected - receivedChunks should still be 0
      expect(result.receivedChunks).toBe(0);
      expect(result.chunkAtNegativeIndex).toBeUndefined();
    });

    test('rejects chunks with index >= totalChunks', async ({ page }) => {
      await page.goto('/index.html?noredirect');

      const result = await page.evaluate(async () => {
        const { createFileTransferManager } = await import('../src/managers/FileTransferManager.js');

        const fileTransfersRef = { current: new Map() };
        const mockMessage = jest => jest;
        const manager = createFileTransferManager({
          fileChannelRef: { current: null },
          fileTransfersRef,
          fileSendTimestampsRef: { current: [] },
          fileReceiveTimestampsRef: { current: [] },
          fileInputRef: { current: null },
          appendMessage: mockMessage,
          appendSystemMessage: mockMessage,
          t: { fileShare: {} }
        });

        // Initialize a transfer with 10 total chunks
        const fileId = 'test-file-2';
        fileTransfersRef.current.set(fileId, {
          chunks: [],
          totalChunks: 10,
          receivedChunks: 0,
          mimeType: 'image/png',
          fileName: 'test.png',
          totalSize: 1000,
          category: 'image',
          direction: 'receive',
          aborted: false,
          progress: 0
        });

        // Try to send chunk with index 10 (out of bounds for 0-9 range)
        const maliciousPayload = JSON.stringify({
          type: 'file-chunk',
          fileId: fileId,
          chunkIndex: 10,
          data: 'dGVzdA=='
        });

        manager.handleIncomingFileMessage(maliciousPayload);

        const transfer = fileTransfersRef.current.get(fileId);
        return {
          receivedChunks: transfer.receivedChunks,
          chunkAtIndex10: transfer.chunks[10]
        };
      });

      // Chunk should be rejected
      expect(result.receivedChunks).toBe(0);
      expect(result.chunkAtIndex10).toBeUndefined();
    });

    test('rejects duplicate chunks', async ({ page }) => {
      await page.goto('/index.html?noredirect');

      const result = await page.evaluate(async () => {
        const { createFileTransferManager } = await import('../src/managers/FileTransferManager.js');

        const fileTransfersRef = { current: new Map() };
        const mockMessage = jest => jest;
        const manager = createFileTransferManager({
          fileChannelRef: { current: null },
          fileTransfersRef,
          fileSendTimestampsRef: { current: [] },
          fileReceiveTimestampsRef: { current: [] },
          fileInputRef: { current: null },
          appendMessage: mockMessage,
          appendSystemMessage: mockMessage,
          t: { fileShare: {} }
        });

        // Initialize a transfer
        const fileId = 'test-file-3';
        fileTransfersRef.current.set(fileId, {
          chunks: [],
          totalChunks: 10,
          receivedChunks: 0,
          mimeType: 'image/png',
          fileName: 'test.png',
          totalSize: 1000,
          category: 'image',
          direction: 'receive',
          aborted: false,
          progress: 0
        });

        // Send chunk 0 first time
        const payload1 = JSON.stringify({
          type: 'file-chunk',
          fileId: fileId,
          chunkIndex: 0,
          data: 'Zmlyc3Q='
        });
        manager.handleIncomingFileMessage(payload1);

        const afterFirst = fileTransfersRef.current.get(fileId).receivedChunks;

        // Try to send chunk 0 again (duplicate)
        const payload2 = JSON.stringify({
          type: 'file-chunk',
          fileId: fileId,
          chunkIndex: 0,
          data: 'c2Vjb25k'
        });
        manager.handleIncomingFileMessage(payload2);

        const afterDuplicate = fileTransfersRef.current.get(fileId).receivedChunks;

        return {
          afterFirst,
          afterDuplicate
        };
      });

      // First chunk should be accepted
      expect(result.afterFirst).toBe(1);
      // Duplicate should be rejected - count should stay at 1
      expect(result.afterDuplicate).toBe(1);
    });
  });

  test.describe('API: Abort and Progress (Fix 1.2 & 1.4)', () => {
    test('abortTransfer marks transfer as aborted', async ({ page }) => {
      await page.goto('/index.html?noredirect');

      const result = await page.evaluate(async () => {
        const { createFileTransferManager } = await import('../src/managers/FileTransferManager.js');

        const fileTransfersRef = { current: new Map() };
        const mockMessage = jest => jest;
        const manager = createFileTransferManager({
          fileChannelRef: { current: null },
          fileTransfersRef,
          fileSendTimestampsRef: { current: [] },
          fileReceiveTimestampsRef: { current: [] },
          fileInputRef: { current: null },
          appendMessage: mockMessage,
          appendSystemMessage: mockMessage,
          t: { fileShare: {} }
        });

        // Create a transfer
        const fileId = 'test-file-abort';
        fileTransfersRef.current.set(fileId, {
          direction: 'send',
          fileName: 'test.png',
          mimeType: 'image/png',
          totalChunks: 100,
          sentChunks: 50,
          aborted: false,
          progress: 50
        });

        // Abort it
        const aborted = manager.abortTransfer(fileId);
        const transfer = fileTransfersRef.current.get(fileId);

        return {
          aborted,
          transferAborted: transfer?.aborted
        };
      });

      expect(result.aborted).toBe(true);
      expect(result.transferAborted).toBe(true);
    });

    test('getActiveTransfers returns transfer info', async ({ page }) => {
      await page.goto('/index.html?noredirect');

      const result = await page.evaluate(async () => {
        const { createFileTransferManager } = await import('../src/managers/FileTransferManager.js');

        const fileTransfersRef = { current: new Map() };
        const mockMessage = jest => jest;
        const manager = createFileTransferManager({
          fileChannelRef: { current: null },
          fileTransfersRef,
          fileSendTimestampsRef: { current: [] },
          fileReceiveTimestampsRef: { current: [] },
          fileInputRef: { current: null },
          appendMessage: mockMessage,
          appendSystemMessage: mockMessage,
          t: { fileShare: {} }
        });

        // Create two transfers
        fileTransfersRef.current.set('file-1', {
          direction: 'send',
          fileName: 'image1.png',
          mimeType: 'image/png',
          totalChunks: 100,
          sentChunks: 25,
          aborted: false,
          progress: 25,
          category: 'image'
        });

        fileTransfersRef.current.set('file-2', {
          direction: 'receive',
          fileName: 'video.mp4',
          mimeType: 'video/mp4',
          totalChunks: 200,
          receivedChunks: 150,
          aborted: false,
          progress: 75,
          category: 'video'
        });

        return manager.getActiveTransfers();
      });

      expect(result.length).toBe(2);

      const sendTransfer = result.find(t => t.direction === 'send');
      expect(sendTransfer.fileName).toBe('image1.png');
      expect(sendTransfer.progress).toBe(25);
      expect(sendTransfer.category).toBe('image');

      const receiveTransfer = result.find(t => t.direction === 'receive');
      expect(receiveTransfer.fileName).toBe('video.mp4');
      expect(receiveTransfer.progress).toBe(75);
      expect(receiveTransfer.category).toBe('video');
    });
  });
});
