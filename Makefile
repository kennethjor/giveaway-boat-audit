init:
	npm install

compile:
	npx tsc

audit: compile
	node build/audit.js

clean:
	rm -R build
