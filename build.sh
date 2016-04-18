
export URL=https://pinpoint-omegablitz.c9users.io
export PORT=443

export ROOT_URL=$URL
export DDP_DEFAULT_CONNECTION_URL=$URL
meteor build $1 --server $URL
