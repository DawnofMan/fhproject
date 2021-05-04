# latest dockerized SSH service
FROM rastasheep/ubuntu-sshd:18.04

# Buildroot version
ARG BUILD_ROOT_RELEASE=2021.02-rc2
#2021.02.1

# Root password for SSH
ARG ROOT_PASSWORD=digitaltwin

# Copy Digital Twin buildroot configutaion files into image
COPY ./config /config

# Setup SSH (for Windows users) and prepare apt-get
RUN echo 'root:${ROOT_PASSWORD}' | chpasswd; \
    # Install all dependencies
    sed -i 's|deb http://us.archive.ubuntu.com/ubuntu/|deb mirror://mirrors.ubuntu.com/mirrors.txt|g' /etc/apt/sources.list; \
    dpkg --add-architecture i386; \
    rm -rf /var/lib/apt/lists/*; \
    apt-get -q update;

# Install all dependencies and prepare buildroot
WORKDIR /root
RUN DEBIAN_FRONTEND=noninteractive apt-get -q -y install \
    bc \
    build-essential \
    bzr \
    cpio \
    cvs \
    git \
    unzip \
    wget \
    libc6:i386 \
    libncurses5-dev \
    libssl-dev \
    rsync; \
    wget -c http://buildroot.org/downloads/buildroot-${BUILD_ROOT_RELEASE}.tar.gz; \
    tar axf buildroot-${BUILD_ROOT_RELEASE}.tar.gz;

# Language setup
ENV LANG='C' \
    LANGUAGE='en_US:en' \
    LC_ALL='C' \ 
    NOTVISIBLE="in users profile" \
    TERM=xterm

# Buildroot will place built artifacts here
VOLUME /build

WORKDIR /root/buildroot-${BUILD_ROOT_RELEASE}
ENTRYPOINT ["/config/build_defconfig.sh"]
