/**
 * IndexedDB Storage Wrapper
 *
 * Zustandのpersistミドルウェアで使用するための
 * IndexedDBストレージ実装。
 *
 * SSR環境（window/indexedDBなし）ではインメモリストレージを
 * フォールバックとして使用します。
 */

const DB_NAME = 'cpl-storage'
const DB_VERSION = 1
const STORE_NAME = 'key-value-store'

/**
 * SSR環境かどうかを判定
 */
export function isSSREnvironment(): boolean {
  return typeof window === 'undefined' || typeof indexedDB === 'undefined'
}

/**
 * インメモリストレージ（SSR環境用）
 */
export function createInMemoryStorage() {
  const store = new Map<string, string>()

  return {
    async getItem(key: string): Promise<string | null> {
      return store.get(key) ?? null
    },
    async setItem(key: string, value: string): Promise<void> {
      store.set(key, value)
    },
    async removeItem(key: string): Promise<void> {
      store.delete(key)
    },
  }
}

/**
 * IndexedDBデータベースの初期化
 */
async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject(new Error(`IndexedDBの初期化に失敗しました: ${request.error}`))
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // オブジェクトストアが存在しない場合は作成
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
  })
}

/**
 * IndexedDBベースのストレージを作成
 *
 * Zustandのpersistミドルウェアと互換性のあるAPIを提供。
 * SSR環境ではインメモリストレージをフォールバックとして使用します。
 */
export function createIndexedDBStorage() {
  // SSR環境の場合はインメモリストレージを返す
  if (isSSREnvironment()) {
    return createInMemoryStorage()
  }

  let dbPromise: Promise<IDBDatabase> | null = null

  const getDB = async (): Promise<IDBDatabase> => {
    if (!dbPromise) {
      dbPromise = initDB()
    }
    return dbPromise
  }

  return {
    /**
     * 値を取得
     */
    async getItem(key: string): Promise<string | null> {
      try {
        const db = await getDB()

        return new Promise((resolve, reject) => {
          const transaction = db.transaction(STORE_NAME, 'readonly')
          const store = transaction.objectStore(STORE_NAME)
          const request = store.get(key)

          request.onsuccess = () => {
            const result = request.result
            resolve(result ?? null)
          }

          request.onerror = () => {
            reject(new Error(`getItemに失敗しました: ${request.error}`))
          }
        })
      } catch (error) {
        console.error('IndexedDB getItem error:', error)
        return null
      }
    },

    /**
     * 値を設定
     */
    async setItem(key: string, value: string): Promise<void> {
      try {
        const db = await getDB()

        return new Promise((resolve, reject) => {
          const transaction = db.transaction(STORE_NAME, 'readwrite')
          const store = transaction.objectStore(STORE_NAME)
          const request = store.put(value, key)

          request.onsuccess = () => {
            resolve()
          }

          request.onerror = () => {
            reject(new Error(`setItemに失敗しました: ${request.error}`))
          }
        })
      } catch (error) {
        console.error('IndexedDB setItem error:', error)
        throw error
      }
    },

    /**
     * 値を削除
     */
    async removeItem(key: string): Promise<void> {
      try {
        const db = await getDB()

        return new Promise((resolve, reject) => {
          const transaction = db.transaction(STORE_NAME, 'readwrite')
          const store = transaction.objectStore(STORE_NAME)
          const request = store.delete(key)

          request.onsuccess = () => {
            resolve()
          }

          request.onerror = () => {
            reject(new Error(`removeItemに失敗しました: ${request.error}`))
          }
        })
      } catch (error) {
        console.error('IndexedDB removeItem error:', error)
        throw error
      }
    },
  }
}

/**
 * ストレージキーの定義
 */
export const STORAGE_KEYS = {
  PREVIEW_STATE: 'preview-state',
  EDIT_HISTORY: 'edit-history',
  AUTO_SAVE: 'auto-save',
} as const
