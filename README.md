# go-starter

A template project that connects go+templ+tailwind+js

## Installation

```bash
npm install
```

## run locally
we use makefile to run air+templ+tailwind+esbuild in watch mode and tie them together with `browser-sync` to allow us browser reloading.

To run them all in parallel just type:
```
make live
```

## Usage
I have included a helper templ method `views.RenderReact` which accepts a prop map and a name which should be the same name of the exported component inside `assets/js/Components`

for example i have a Counter.tsx component which is imported in the `assets/js/index.tsx` (which is the entrypoint of our javascript) and by providing a
```go
		@views.RenderReact(map[string]any{/*your props would go here*/}, "Counter")
```
we are able to render a react component from a templ file and also passing to it props


