BUILD_PATH			=	.
IPC_DOCKER_NAME		=	ipc:latest
PORT				=	3000

all			:	build start

build		:
	@echo "🚧 Building ipc's docker image..."
	docker build $(BUILD_PATH) -t $(IPC_DOCKER_NAME)

start		:
	@echo "🚀 Starting ipc's docker image..."
	docker run -p $(PORT):$(PORT) $(IPC_DOCKER_NAME)

tests-no-ui	:
	@echo "🧪 Starting tests with no user interface..."
	npx cypress run

tests-ui	:
	@echo "🧪 Starting tests with user interface..."
	npx cypress open

.PHONY		:	all build start tests-no-ui tests-ui