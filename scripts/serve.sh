#!/bin/bash
docker build -t animal_labeller:latest -f docker/Dockerfile .
docker run --rm -v ./data:/usr/src/app/data -it -p 3000:3000 -p 3001:3001 animal_labeller:latest