import Deferred from "./Deferred";

interface XHROptions {
  data: Document | XMLHttpRequestBodyInit | null;
  callback?: (progress: number, completed: boolean) => void;
  method?: string;
  url: string;
}

export const sendXHR = ({
  data,
  callback,
  method = "POST",
  url,
}: XHROptions): Promise<XMLHttpRequest> => {
  const { promise, resolve, reject } = new Deferred<XMLHttpRequest>();
  const xhr = new XMLHttpRequest();

  xhr.addEventListener("progress", (e) => {
    // Only calculate progress if total size is known
    const total = e.total || 0;
    const progress = total > 0 ? Math.round((e.loaded / total) * 100) : 0;
    const completed = total > 0 && e.loaded >= total;
    callback?.(progress, completed);
  });

  xhr.addEventListener("load", () => resolve(xhr));
  xhr.addEventListener("error", (e) => {
    console.error("Error while processing XHR request:", e);
    reject(e);
  });

  xhr.open(method, url);
  xhr.send(data);

  return promise;
};
