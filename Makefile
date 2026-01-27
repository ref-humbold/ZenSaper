IMAGE = refhumbold/zen-saper
TAG = make
PORT = 80

ifeq ($(DEV), true)
DOCKERFILE = Dockerfile.dev
NAME = $(IMAGE):$(TAG)-dev
IN_PORT = 4200
else
DOCKERFILE = Dockerfile
NAME = $(IMAGE):$(TAG)
IN_PORT = 80
endif

.PHONY : all build run

all : run

build :
	docker build -f $(DOCKERFILE) -t $(NAME) .

run : build
	docker run -p $(PORT):$(IN_PORT) --rm $(NAME)
