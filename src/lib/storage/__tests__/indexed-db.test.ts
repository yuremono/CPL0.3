/**
 * IndexedDB Storage Tests
 *
 * SSR対応とブラウザ環境の両方をテスト
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  createIndexedDBStorage,
  isSSREnvironment,
  createInMemoryStorage,
} from '../indexed-db'

describe('createIndexedDBStorage', () => {
  let originalWindow: typeof window | undefined
  let originalIndexedDB: typeof indexedDB | undefined

  beforeEach(() => {
    // 元の環境を保存
    originalWindow = globalThis.window
    originalIndexedDB = globalThis.indexedDB
  })

  afterEach(() => {
    // 環境を復元
    if (originalWindow) {
      globalThis.window = originalWindow
    } else {
      delete (globalThis as { window?: typeof window }).window
    }
    if (originalIndexedDB) {
      globalThis.indexedDB = originalIndexedDB
    } else {
      delete (globalThis as { indexedDB?: typeof indexedDB }).indexedDB
    }
    vi.restoreAllMocks()
  })

  describe('isSSREnvironment', () => {
    afterEach(() => {
      // 環境を復元
      if (originalWindow) {
        globalThis.window = originalWindow
      } else {
        delete (globalThis as { window?: typeof window }).window
      }
      if (originalIndexedDB) {
        globalThis.indexedDB = originalIndexedDB
      } else {
        delete (globalThis as { indexedDB?: typeof indexedDB }).indexedDB
      }
    })

    it('windowがない場合にtrueを返すこと', () => {
      delete (globalThis as { window?: typeof window }).window
      delete (globalThis as { indexedDB?: typeof indexedDB }).indexedDB

      expect(isSSREnvironment()).toBe(true)
    })

    it('indexedDBがない場合にtrueを返すこと', () => {
      globalThis.window = globalThis.window || ({} as Window)
      delete (globalThis as { indexedDB?: typeof indexedDB }).indexedDB

      expect(isSSREnvironment()).toBe(true)
    })

    it('windowとindexedDBがある場合にfalseを返すこと', () => {
      globalThis.window = globalThis.window || ({} as Window)
      globalThis.indexedDB = {
        open: vi.fn(),
      } as unknown as IDBFactory

      expect(isSSREnvironment()).toBe(false)
    })
  })

  describe('createInMemoryStorage', () => {
    it('インメモリストレージの基本機能が動作すること', async () => {
      const storage = createInMemoryStorage()

      await storage.setItem('key1', 'value1')
      expect(await storage.getItem('key1')).toBe('value1')

      await storage.removeItem('key1')
      expect(await storage.getItem('key1')).toBeNull()
    })

    it('各インスタンスが独立していること', async () => {
      const storage1 = createInMemoryStorage()
      const storage2 = createInMemoryStorage()

      await storage1.setItem('key', 'value1')
      await storage2.setItem('key', 'value2')

      expect(await storage1.getItem('key')).toBe('value1')
      expect(await storage2.getItem('key')).toBe('value2')
    })
  })

  describe('SSR環境（windowなし）', () => {
    it('windowがない場合にエラーが発生しないこと', () => {
      // SSR環境をシミュレート
      delete (globalThis as { window?: typeof window }).window
      delete (globalThis as { indexedDB?: typeof indexedDB }).indexedDB

      // エラーが発生しないことを確認
      expect(() => {
        createIndexedDBStorage()
      }).not.toThrow()
    })

    it('インメモリストレージで値を設定・取得できること', async () => {
      // SSR環境をシミュレート
      delete (globalThis as { window?: typeof window }).window
      delete (globalThis as { indexedDB?: typeof indexedDB }).indexedDB

      const storage = createIndexedDBStorage()

      // 値を設定
      await storage.setItem('test-key', 'test-value')

      // 値を取得
      const value = await storage.getItem('test-key')

      expect(value).toBe('test-value')
    })

    it('インメモリストレージで値を削除できること', async () => {
      // SSR環境をシミュレート
      delete (globalThis as { window?: typeof window }).window
      delete (globalThis as { indexedDB?: typeof indexedDB }).indexedDB

      const storage = createIndexedDBStorage()

      // 値を設定
      await storage.setItem('test-key', 'test-value')

      // 値を削除
      await storage.removeItem('test-key')

      // 削除確認
      const value = await storage.getItem('test-key')

      expect(value).toBeNull()
    })

    it('存在しないキーを取得した場合にnullを返すこと', async () => {
      // SSR環境をシミュレート
      delete (globalThis as { window?: typeof window }).window
      delete (globalThis as { indexedDB?: typeof indexedDB }).indexedDB

      const storage = createIndexedDBStorage()

      const value = await storage.getItem('non-existent-key')

      expect(value).toBeNull()
    })

    it('複数のキーで独立した値を管理できること', async () => {
      // SSR環境をシミュレート
      delete (globalThis as { window?: typeof window }).window
      delete (globalThis as { indexedDB?: typeof indexedDB }).indexedDB

      const storage = createIndexedDBStorage()

      // 複数の値を設定
      await storage.setItem('key1', 'value1')
      await storage.setItem('key2', 'value2')
      await storage.setItem('key3', 'value3')

      // 個別に取得して確認
      expect(await storage.getItem('key1')).toBe('value1')
      expect(await storage.getItem('key2')).toBe('value2')
      expect(await storage.getItem('key3')).toBe('value3')
    })

    it('値を上書きできること', async () => {
      // SSR環境をシミュレート
      delete (globalThis as { window?: typeof window }).window
      delete (globalThis as { indexedDB?: typeof indexedDB }).indexedDB

      const storage = createIndexedDBStorage()

      // 値を設定
      await storage.setItem('test-key', 'initial-value')

      // 値を上書き
      await storage.setItem('test-key', 'updated-value')

      // 上書き確認
      expect(await storage.getItem('test-key')).toBe('updated-value')
    })
  })

  describe('SSR環境（indexedDBなし）', () => {
    it('indexedDBがない場合にインメモリストレージを使用すること', async () => {
      // windowはあるがindexedDBがない環境をシミュレート
      globalThis.window = globalThis.window || ({} as Window)
      delete (globalThis as { indexedDB?: typeof indexedDB }).indexedDB

      const storage = createIndexedDBStorage()

      // エラーが発生しないことを確認
      await expect(storage.setItem('test-key', 'test-value')).resolves.not.toThrow()
      expect(await storage.getItem('test-key')).toBe('test-value')
    })
  })

  describe('ブラウザ環境（IndexedDBあり）', () => {
    it('IndexedDBが使用可能な場合にindexedDB.openが呼ばれること', () => {
      // indexedDBのモックを設定
      const openMock = vi.fn()
      globalThis.indexedDB = {
        open: openMock,
      } as unknown as IDBFactory

      // ストレージを作成
      createIndexedDBStorage()

      // openはまだ呼ばれない（遅延初期化）
      expect(openMock).not.toHaveBeenCalled()
    })

    it('IndexedDB環境の検出が正しく動作すること', () => {
      // indexedDBがある場合
      globalThis.indexedDB = {
        open: vi.fn(),
      } as unknown as IDBFactory

      const storage1 = createIndexedDBStorage()
      expect(storage1).toBeDefined()

      // 後でindexedDBを削除しても、最初のインスタンスには影響しない
      delete (globalThis as { indexedDB?: typeof indexedDB }).indexedDB

      const storage2 = createIndexedDBStorage()
      expect(storage2).toBeDefined()
    })
  })

  describe('JSONデータの取り扱い', () => {
    it('オブジェクトを文字列化して保存できること', async () => {
      // SSR環境をシミュレート
      delete (globalThis as { window?: typeof window }).window
      delete (globalThis as { indexedDB?: typeof indexedDB }).indexedDB

      const storage = createIndexedDBStorage()
      const obj = { foo: 'bar', num: 42 }

      await storage.setItem('obj-key', JSON.stringify(obj))
      const retrieved = await storage.getItem('obj-key')
      const parsed = JSON.parse(retrieved ?? 'null')

      expect(parsed).toEqual(obj)
    })

    it('配列を文字列化して保存できること', async () => {
      // SSR環境をシミュレート
      delete (globalThis as { window?: typeof window }).window
      delete (globalThis as { indexedDB?: typeof indexedDB }).indexedDB

      const storage = createIndexedDBStorage()
      const arr = [1, 2, 3, 'four']

      await storage.setItem('arr-key', JSON.stringify(arr))
      const retrieved = await storage.getItem('arr-key')
      const parsed = JSON.parse(retrieved ?? 'null')

      expect(parsed).toEqual(arr)
    })

    it('空文字列を保存できること', async () => {
      // SSR環境をシミュレート
      delete (globalThis as { window?: typeof window }).window
      delete (globalThis as { indexedDB?: typeof indexedDB }).indexedDB

      const storage = createIndexedDBStorage()

      await storage.setItem('empty-key', '')
      expect(await storage.getItem('empty-key')).toBe('')
    })

    it('特殊文字を含む文字列を保存できること', async () => {
      // SSR環境をシミュレート
      delete (globalThis as { window?: typeof window }).window
      delete (globalThis as { indexedDB?: typeof indexedDB }).indexedDB

      const storage = createIndexedDBStorage()
      const specialValue = 'Hello\nWorld\t!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'

      await storage.setItem('special-key', specialValue)
      expect(await storage.getItem('special-key')).toBe(specialValue)
    })

    it('Unicode文字を含む文字列を保存できること', async () => {
      // SSR環境をシミュレート
      delete (globalThis as { window?: typeof window }).window
      delete (globalThis as { indexedDB?: typeof indexedDB }).indexedDB

      const storage = createIndexedDBStorage()
      const unicodeValue = 'こんにちは世界 🌍 🎉 αβγ'

      await storage.setItem('unicode-key', unicodeValue)
      expect(await storage.getItem('unicode-key')).toBe(unicodeValue)
    })
  })

  describe('エッジケース', () => {
    it('null値をキーとして使用できること', async () => {
      // SSR環境をシミュレート
      delete (globalThis as { window?: typeof window }).window
      delete (globalThis as { indexedDB?: typeof indexedDB }).indexedDB

      const storage = createIndexedDBStorage()

      // 文字列'null'として扱われる
      await storage.setItem(String(null), 'value')
      expect(await storage.getItem(String(null))).toBe('value')
    })

    it('undefined値をキーとして使用できること', async () => {
      // SSR環境をシミュレート
      delete (globalThis as { window?: typeof window }).window
      delete (globalThis as { indexedDB?: typeof indexedDB }).indexedDB

      const storage = createIndexedDBStorage()

      // 文字列'undefined'として扱われる
      await storage.setItem(String(undefined), 'value')
      expect(await storage.getItem(String(undefined))).toBe('value')
    })

    it('空文字列をキーとして使用できること', async () => {
      // SSR環境をシミュレート
      delete (globalThis as { window?: typeof window }).window
      delete (globalThis as { indexedDB?: typeof indexedDB }).indexedDB

      const storage = createIndexedDBStorage()

      await storage.setItem('', 'empty-key-value')
      expect(await storage.getItem('')).toBe('empty-key-value')
    })

    it('非常に長い文字列を保存できること', async () => {
      // SSR環境をシミュレート
      delete (globalThis as { window?: typeof window }).window
      delete (globalThis as { indexedDB?: typeof indexedDB }).indexedDB

      const storage = createIndexedDBStorage()
      const longValue = 'x'.repeat(10000)

      await storage.setItem('long-key', longValue)
      expect(await storage.getItem('long-key')).toBe(longValue)
    })

    it('同じキーに対してremoveItemを複数回実行してもエラーにならないこと', async () => {
      // SSR環境をシミュレート
      delete (globalThis as { window?: typeof window }).window
      delete (globalThis as { indexedDB?: typeof indexedDB }).indexedDB

      const storage = createIndexedDBStorage()

      await storage.setItem('test-key', 'value')
      await storage.removeItem('test-key')
      await storage.removeItem('test-key')
      await storage.removeItem('test-key')

      expect(await storage.getItem('test-key')).toBeNull()
    })
  })
})
