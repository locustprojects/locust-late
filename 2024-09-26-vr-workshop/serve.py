import http.server
import socketserver
import webbrowser
import os
import json
import zipfile

# Set the port
PORT = 8000

# Get the directory of this script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Change directory to where the HTML files are stored
os.chdir(script_dir)

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):

        # Parse the form data posted
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)

        # Parse the received data
        try:
            data = json.loads(post_data)
            print("Received data:", data)

            # Ensure the 'exports' directory exists
            exports_dir = 'assets/exports'
            os.makedirs(exports_dir, exist_ok=True)  

            # Save the settings to a file
            settings_filename = os.path.join(exports_dir, 'settings.json')
            with open(settings_filename, 'w') as settings_file:
                json.dump(data, settings_file, indent=4)

            # Archive the settings with track.glb
            track_file = 'assets/models/track.glb'
            archive_filename = os.path.join(exports_dir, 'bundled_coaster.zip')

            # Create a ZIP archive containing settings.json and track.glb
            with zipfile.ZipFile(archive_filename, 'w') as archive:

                # Add settings.json to the archive
                archive.write(settings_filename, arcname='settings.json')

                # Add track.glb to the archive
                archive.write(track_file, arcname='track.glb')

            # Send a success response
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'Settings saved and archived successfully.')
        except Exception as e:

            # Handle errors
            print("Error handling POST request:", e)
            self.send_response(500)
            self.end_headers()
            self.wfile.write(b'Error processing the request.')

# Set up the server
with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    # Automatically open the default browser to the right address
    print(f"Serving at http://localhost:{PORT}")
    webbrowser.open(f"http://localhost:{PORT}")

    # Keep the server running
    httpd.serve_forever()
