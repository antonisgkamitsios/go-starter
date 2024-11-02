package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"os"
	"strconv"

	"github.com/antonisgkamitsios/go-starter/internal/htmx"
	pages "github.com/antonisgkamitsios/go-starter/views/pages"
	"github.com/joho/godotenv"
)

type config struct {
	env  string
	port int
}

type application struct {
	cfg config
}

func (app *application) disableCacheInDevMode(next http.Handler) http.Handler {
	if app.cfg.env != "development" {
		return next
	}
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-store")
		next.ServeHTTP(w, r)
	})
}

func (app *application) comesFromHTMX(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		test := r.Header.Get("Hx-Request")
		ctx := context.WithValue(r.Context(), htmx.HTMXRequestKEY, test != "")

		r = r.WithContext(ctx)

		next.ServeHTTP(w, r)
	})
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	var cfg config
	port, err := strconv.Atoi(os.Getenv("PORT"))
	if err != nil {
		slog.Warn("cannot process port, proceeding with default 3000")
		port = 3000
	}

	env := os.Getenv("ENV")
	if env == "" {
		slog.Warn(`cannot locate env, proceeding with default: "development"`)
		env = "development"
	}

	flag.IntVar(&cfg.port, "port", port, "the port of the server")
	flag.Parse()

	app := application{cfg: cfg}

	mux := http.NewServeMux()
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		pages.Home(map[string]any{"name": "antonis", "whatever": 4}).Render(r.Context(), w)
	})

	mux.HandleFunc("/about", func(w http.ResponseWriter, r *http.Request) {
		pages.About().Render(r.Context(), w)
	})

	fmt.Printf("Server is listening on port %d", cfg.port)
	err = http.ListenAndServe(fmt.Sprintf(":%d", cfg.port), app.disableCacheInDevMode(app.comesFromHTMX(mux)))
	if err != nil {
		log.Fatal(err)
	}
}
