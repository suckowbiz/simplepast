FROM ubuntu:24.04
LABEL maintainer="Tobias Suckow <tobias@suckow.biz>"
RUN apt-get update \
 && apt-get install --yes --no-install-recommends \
      imagemagick \
      tree
COPY ./articlectl /usr/bin/articlectl
ENTRYPOINT [ "articlectl" ]
