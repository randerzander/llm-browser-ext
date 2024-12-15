from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from llm_scratch import haiku as llm

class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        print(json.loads(post_data).keys())
        prompt = json.loads(post_data)["userPrompt"]
        page_text = json.loads(post_data)["text"]
        
        #print(f"Received POST data: {post_data}")
        summary = llm(f"{prompt} \n {page_text}")
        print(f"Generated summary: {summary}")
        
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        self.wfile.write(summary.encode('utf-8'))

def run_server(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
    print(f"Server running on port {port}")
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
