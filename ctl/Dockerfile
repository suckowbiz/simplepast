FROM ubuntu:22.04
LABEL maintainer="Tobias Suckow <tobias@suckow.biz>"
RUN apt-get update && apt-get install imagemagick --yes
COPY ./articlectl /usr/bin/articlectl
CMD [ "articlectl" ]
