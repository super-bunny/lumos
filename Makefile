# Cross build Windows binary with Docker buildkit (without Sentry)
build_prod_windows_without_sentry:
	rm -rf ./out/make/squirrel.windows
	DOCKER_BUILDKIT=1 docker build \
	  --build-arg NODE_ENV=production \
	  --build-arg ENABLE_SENTRY=false \
	  -f Dockerfile.build.windows . \
	  -t lumos-win-build \
	  -o=./out/make

# Cross build Windows binary with Docker buildkit (with Sentry)
build_prod_windows_with_sentry:
	rm -rf ./out/make/squirrel.windows
	DOCKER_BUILDKIT=1 docker build \
	  --build-arg SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN} \
	  --build-arg NODE_ENV=production \
	  --build-arg ENABLE_SENTRY=true \
	  -f Dockerfile.build.windows . \
	  -t lumos-win-build \
	  -o=./out/make


build_prod_deb_without_sentry:
	ENABLE_SENTRY=false NODE_ENV=production yarn make --targets @electron-forge/maker-deb