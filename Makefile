build_windows:
	rm -rf ./out/make/squirrel.windows
	# Build the Windows binary
	DOCKER_BUILDKIT=1 docker build -f Dockerfile.build.windows . -t lumos-win-build -o=./out/make
