include .env
# run templ generation in watch mode to detect all .templ files and 
# re-create _templ.txt files on change, then send reload event to browser. 
# Default url: http://localhost:7331
live/templ:
	templ generate --watch --proxy="http://localhost:${PORT}" --open-browser=false -v

# run air to detect any go file changes to re-build and re-run the server.
live/server:
	@lsof -t -i :${PORT} | xargs -r kill
	go run github.com/cosmtrek/air@v1.51.0 \
	--build.cmd "go build -o tmp/bin/main" --build.bin "tmp/bin/main" --build.delay "100" \
	--build.exclude_dir "node_modules" \
	--build.include_ext "go" \
	--build.stop_on_error "false" \
	--misc.clean_on_exit true

# run tailwindcss to generate the styles.css bundle in watch mode.
live/tailwind:
	npx tailwindcss -i assets/css/app.css -o static/styles.css --minify --watch=always

# run esbuild to generate the index.js bundle in watch mode.
live/esbuild:
	npx esbuild --bundle assets/js/index.tsx --outdir=static/ --global-name=bundle --watch=forever

# watch for any js or css change in the assets/ folder, then reload the browser via templ proxy.
live/sync_assets:
	go run github.com/cosmtrek/air@v1.51.0 \
	--build.cmd "templ generate --notify-proxy" \
	--build.bin "true" \
	--build.delay "100" \
	--build.exclude_dir "" \
	--build.include_dir "static" \
	--build.include_ext "js,css"

live:
	make -j5 live/templ live/server live/tailwind live/esbuild live/sync_assets