build_windows:
	rm -rf ./out/make/squirrel.windows
	# Build the Windows binary
	DOCKER_BUILDKIT=1 docker build --build-arg SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN} -f Dockerfile.build.windows . -t lumos-win-build -o=./out/make
