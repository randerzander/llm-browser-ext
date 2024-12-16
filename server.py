from http.server import HTTPServer, BaseHTTPRequestHandler
import json, re, time, multiprocessing
from llm_scratch import haiku as llm

def parallel(func, args):
    t0 = time.time()
    cpus = multiprocessing.cpu_count()
    with multiprocessing.Pool(processes=cpus) as pool:
        result = pool.map(func, args)
    t1 = time.time()
    print(f"Parallel execution took {t1-t0} seconds for {str(func)} on {len(args)} items")
    return result

def infer(prompt):
    pr = prompt.split("\n")[0]
    print(f"Running prompt: {pr}\n..")
    t0 = time.time()
    res = llm(prompt)
    t1 = time.time()
    print(f"Time taken: {t1-t0}\n{pr}")
    return res

class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        print(json.loads(post_data).keys())
        prompt = json.loads(post_data)["userPrompt"]
        page_text = json.loads(post_data)["text"]

        prompts = split_by_numbered_sequence(prompt)
        prompts = [f"{prompt} \n {page_text}" for prompt in prompts]
        results = parallel(infer, prompts)
        resp = "<p>".join(results)
        
        #print(f"Received POST data: {post_data}")
        #resp = llm(f"{prompt} \n {page_text}")
        
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        self.wfile.write(resp.encode('utf-8'))


def split_by_numbered_sequence(text):
    # Split by numbered sequences like 1., 2., 3., etc.
    sections = re.split(r'\s*\d+\.\s*', text)
    # Remove empty first element if exists
    return [section for section in sections if section]


def run_server(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
    print(f"Server running on port {port}")
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()

