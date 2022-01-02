NPX	=	npx
DOCKER	=	docker
CYPRESS	=	cypress

RUN	=	run
BUILD	=	build
OPEN	=	open

BUILD_PATH	=	.
IPC_DOCKER_NAME	=	ipc:latest
PORT	=	3000

all	:	build start

build	:
	@echo "🚧 Building ipc's docker image..."
	$(DOCKER) $(BUILD) $(BUILD_PATH) -t $(IPC_DOCKER_NAME)

start	:
	@echo "🚀 Starting ipc's docker image..."
	$(DOCKER) $(RUN) -p $(PORT):$(PORT) $(IPC_DOCKER_NAME)

tests-no-ui	:
	@echo "🧪 Starting tests with no user interface..."
	$(NPX) $(CYPRESS) $(RUN)

tests-ui	:
	@echo "🧪 Starting tests with user interface..."
	$(NPX) $(CYPRESS) $(OPEN)

.PHONY:	all build start test