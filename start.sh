#!/bin/bash
# set -o errexit
# set -o nounset
# set -o pipefail

APP=v2-controller
COMMIT_ID=$(git rev-parse --verify HEAD)
VERSION="${VERSION:-"${COMMIT_ID:0:8}"}"

function build() {
  echo "Build.....""
  docker build -t ${APP}:${VERSION} --platform linux/amd64 -f Dockerfile .
  # docker push ${REPO}/${APP}:${VERSION}
  echo "End....."
};

function run(){
  echo "Running.....""
  docker rm -f v2-controller && \
  docker run --name sky-vehicle-manage-ui-nginx --restart=always -itd \
    -e API_HOST=${API_HOST} \
    -p 80:80 \
    ${APP}:${VERSION}

  echo "End....."
}

while true
do
  case "$1" in
  build)
      build
      shift
      ;;
  run)
      run
      shift
      ;;
  -h|--help)
      usage
      ;;
  esac
shift
done