FROM debian:stretch
RUN apt-get update  \
	&& apt-get install -y --no-install-recommends ca-certificates curl netbase wget  \
	&& rm -rf /var/lib/apt/lists/*
RUN set -ex; if ! command -v gpg > /dev/null; then apt-get update; apt-get install -y --no-install-recommends gnupg dirmngr ; rm -rf /var/lib/apt/lists/*; fi
RUN apt-get update  \
	&& apt-get install -y --no-install-recommends git mercurial openssh-client subversion procps  \
	&& rm -rf /var/lib/apt/lists/*
RUN set -ex; apt-get update; DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends autoconf automake bzip2 dpkg-dev file g++ gcc imagemagick libbz2-dev libc6-dev libcurl4-openssl-dev libdb-dev libevent-dev libffi-dev libgdbm-dev libglib2.0-dev libgmp-dev libjpeg-dev libkrb5-dev liblzma-dev libmagickcore-dev libmagickwand-dev libmaxminddb-dev libncurses5-dev libncursesw5-dev libpng-dev libpq-dev libreadline-dev libsqlite3-dev libssl-dev libtool libwebp-dev libxml2-dev libxslt-dev libyaml-dev make patch unzip xz-utils zlib1g-dev $( if apt-cache show 'default-libmysqlclient-dev' 2>/dev/null | grep -q '^Version:'; then echo 'default-libmysqlclient-dev'; else echo 'libmysqlclient-dev'; fi ) ; rm -rf /var/lib/apt/lists/*
ENV PATH=/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
ENV LANG=C.UTF-8
RUN apt-get update  \
	&& apt-get install -y --no-install-recommends libbluetooth-dev tk-dev uuid-dev  \
	&& rm -rf /var/lib/apt/lists/*
RUN file="$(which openssl)" && echo $file
RUN username=$(docker info | sed '/Username:/!d;s/.* //') && echo $username
RUN apt-get update  \
	&& apt install -y build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev wget
RUN wget https://www.openssl.org/source/openssl-1.0.2g.tar.gz -O - | tar -xz
WORKDIR /openssl-1.0.2g
RUN ./config --prefix=/usr/local/openssl --openssldir=/usr/local/openssl && make && make install

ENV GPG_KEY=A035C8C19219BA821ECEA86B64E628F8D684696D
ENV PYTHON_VERSION=3.10.4
RUN set -ex  \
	&& wget -O python.tar.xz "https://www.python.org/ftp/python/$PYTHON_VERSION/Python-$PYTHON_VERSION.tar.xz"  \
	&& wget -O python.tar.xz.asc "https://www.python.org/ftp/python/$PYTHON_VERSION/Python-$PYTHON_VERSION.tar.xz.asc"  \
	&& export GNUPGHOME="$(mktemp -d)"  \
	&& gpg --batch --keyserver keyserver.ubuntu.com --recv-keys "$GPG_KEY"  \
	&& gpg --batch --verify python.tar.xz.asc python.tar.xz  \
	&& { command -v gpgconf > /dev/null  \
	&& gpgconf --kill all || :; }  \
	&& rm -rf "$GNUPGHOME" python.tar.xz.asc  \
	&& mkdir -p /usr/src/python  \
	&& tar -xJC /usr/src/python --strip-components=1 -f python.tar.xz  \
	&& rm python.tar.xz  \
	&& cd /usr/src/python  \
	&& gnuArch="$(dpkg-architecture --query DEB_BUILD_GNU_TYPE)"  \
	&& ./configure  \
	&& make   \
	# && ./configure --build="$gnuArch" --enable-loadable-sqlite-extensions --enable-optimizations --enable-option-checking=fatal --enable-shared --with-system-expat --with-system-ffi --without-ensurepip  \
	# && make -j "$(nproc)"  \
	&& make install  \
	&& ldconfig  \
	&& find /usr/local -depth \( \( -type d -a \( -name test -o -name tests -o -name idle_test \) \) -o \( -type f -a \( -name '*.pyc' -o -name '*.pyo' \) \) \) -exec rm -rf '{}' +  \
	&& rm -rf /usr/src/python  \
	&& python3 --version
RUN echo $(python3 --version)
RUN cd /usr/local/bin  \
	&& ln -s idle3 idle  \
	&& ln -s pydoc3 pydoc  \
	&& ln -s python3 python  \
	&& ln -s python3-config python-config
ENV PYTHON_PIP_VERSION=22.0.4
ENV PYTHON_GET_PIP_URL=https://github.com/pypa/get-pip/raw/38e54e5de07c66e875c11a1ebbdb938854625dd8/public/get-pip.py
ENV PYTHON_GET_PIP_SHA256=e235c437e5c7d7524fbce3880ca39b917a73dc565e0c813465b7a7a329bb279a
RUN set -ex; curl "$PYTHON_GET_PIP_URL" -o get-pip.py; python3 get-pip.py; find /usr/local -depth \( \( -type d -a \( -name test -o -name idle_test -o -name tests \) \) -o \( -type f -a \( -name '*.pyc' -o -name '*.pyo' \) \) \) -exec rm -rf '{}' +; rm -f get-pip.py
CMD ["python3"]
RUN pip3 --version && pip3 install -U pip --trusted-host mirrors.aliyun.com --index-url=http://mirrors.aliyun.com/pypi/simple && pip3 install pyteal --trusted-host mirrors.aliyun.com --index-url=http://mirrors.aliyun.com/pypi/simple