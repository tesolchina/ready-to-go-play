type QueueItem = {
  id: string;
  execute: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (error: any) => void;
  timestamp: number;
};

class RequestQueue {
  private queue: QueueItem[] = [];
  private processing = false;
  private concurrentLimit = 3; // Process 3 requests at a time
  private activeRequests = 0;
  private listeners: Map<string, (position: number, total: number) => void> = new Map();

  async add<T>(execute: () => Promise<T>): Promise<T> {
    const id = crypto.randomUUID();
    
    return new Promise<T>((resolve, reject) => {
      const item: QueueItem = {
        id,
        execute,
        resolve,
        reject,
        timestamp: Date.now(),
      };

      this.queue.push(item);
      this.notifyListeners();
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.activeRequests >= this.concurrentLimit) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0 && this.activeRequests < this.concurrentLimit) {
      const item = this.queue.shift();
      if (!item) break;

      this.activeRequests++;
      this.notifyListeners();

      this.executeWithRetry(item)
        .then((result) => {
          item.resolve(result);
        })
        .catch((error) => {
          item.reject(error);
        })
        .finally(() => {
          this.activeRequests--;
          this.notifyListeners();
          this.processQueue();
        });
    }

    this.processing = false;
  }

  private async executeWithRetry(item: QueueItem, maxRetries = 2): Promise<any> {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await item.execute();
      } catch (error: any) {
        lastError = error;
        
        // Don't retry on validation errors or non-500 errors
        if (error.status && error.status < 500) {
          throw error;
        }

        // Exponential backoff: 2s, 4s
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 2000 * Math.pow(2, attempt)));
        }
      }
    }

    throw lastError;
  }

  onQueueChange(id: string, callback: (position: number, total: number) => void) {
    this.listeners.set(id, callback);
    this.notifyListeners();
  }

  removeListener(id: string) {
    this.listeners.delete(id);
  }

  private notifyListeners() {
    const total = this.queue.length + this.activeRequests;
    this.queue.forEach((item, index) => {
      const listener = this.listeners.get(item.id);
      if (listener) {
        listener(index + this.activeRequests, total);
      }
    });
  }

  getQueueStatus() {
    return {
      waiting: this.queue.length,
      processing: this.activeRequests,
      total: this.queue.length + this.activeRequests,
    };
  }
}

export const requestQueue = new RequestQueue();
