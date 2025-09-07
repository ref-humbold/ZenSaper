IMAGE = refhumbold/zen-saper
DOCKERFILE = Dockerfile
DOCKERFILE_DEV = Dockerfile.dev
TAG = $(IMAGE):make
TAG_DEV = $(TAG)-dev

.PHONY : all build build-dev run run-dev

all : run

build :
	docker build -f $(DOCKERFILE) -t $(TAG) .
build-dev :
	docker build -f $(DOCKERFILE_DEV) -t $(TAG_DEV) .

run : build
	docker run -p 80:80 --rm $(TAG)

run-dev : build-dev
	docker run -p 80:80 --rm $(TAG_DEV)
