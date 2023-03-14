build_dev_windows:
	rm -rf ./out/make/squirrel.windows
	# Build the Windows binary
	DOCKER_BUILDKIT=1 docker build \
	  --build-arg SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN} \
	  --build-arg NODE_ENV=production \
	  --build-arg ENABLE_SENTRY=false \
	  -f Dockerfile.build.windows . \
	  -t lumos-win-build \
	  -o=./out/make

build_dev_deb:
	ENABLE_SENTRY=false NODE_ENV=production yarn make --targets @electron-forge/maker-deb