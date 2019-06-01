cd ~/msc/webtech/webtech/client
docker image build -t timvan33/webtech-client .
docker push timvan33/webtech-client
cd ~/msc/webtech/webtech/server
docker image build -t timvan33/webtech-server .
docker push timvan33/webtech-server