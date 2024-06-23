ARG NODE_VERSION
FROM node:${NODE_VERSION}

RUN apt-get update && \
    apt-get install git sudo -y && \
    apt-get clean

WORKDIR /tmp
COPY scripts/*.sh .
RUN chmod +x *.sh

ARG USER
RUN deluser --remove-all-files node && \
    ./create-user.sh ${USER}

ARG WORKSPACE
ARG PROFILE
RUN mv load-*.sh /home/${USER}/ && \
    usermod -aG sudo ${USER} && \
    echo "%sudo ALL=(ALL:ALL) ALL" | EDITOR="tee -a" visudo && \
    echo ". ~/load-env.sh ${WORKSPACE} ${PROFILE}" >> /home/${USER}/.bashrc

USER ${USER}
RUN ./install-bun.sh