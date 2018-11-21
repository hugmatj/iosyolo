IMAGE          ?= bertychat/yolo
HOST           ?= root@167.99.223.55
HOSTNAME       ?= yolo.berty.io
CIRCLE_TOKEN   ?= ***REMOVED***

.PHONY: install
install:
	GOPROXY=http://goproxy.berty.io:3000/ GO111MODULE=on go install -v ./cmd/...

.PHONY: docker.build
docker.build:
	docker build -t "$(IMAGE)" .

.PHONY: docker.push

docker.push: docker.build
	docker push "$(IMAGE)"

.PHONY: deploy
deploy:
	ssh "$(HOST)" docker pull "$(IMAGE)" \
		&& (docker rm -f yolo || true) \
		&& docker run --name yolo -d -p 80:3670 bertychat/yolo \
				-t "$(CIRCLE_TOKEN)" serve \
				--hostname "$(HOSTNAME)" -p 'xor+=cool'

.PHONY: release
release: docker.build docker.push deploy

