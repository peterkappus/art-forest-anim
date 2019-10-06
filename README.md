# P5 manager docker Capture

A simple starter kit for creating p5 animations using [p5 manager](https://github.com/chiunhau/p5-manager) inside a docker container and then capturing them to video, pngs, gifs, etc.

Big thanks to this blog post: https://peterbeshai.com/blog/2018-10-28-p5js-ccapture/ and this repo: https://github.com/pbeshai/p5js-ccapture

## Usage
```
#first time
docker build . --force-rm

## then (and subsequent times)
docker run -d -p 5555:5555 -p 35729:35729 -v"$(PWD)":/app p5manager; sleep 5; open http://localhost:5555
```
