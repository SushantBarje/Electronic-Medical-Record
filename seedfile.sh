#!/bin/bash
PATHTOKEY="network-config/organizations/peerOrganizations/doctor.hospital_network.com/users/Admin@doctor.hospital_network.com/msp/keystore"
cd $PATHTOKEY
FILES=`ls -ltr | grep "^-" | awk '{print $NF}'`
echo $FILES
cd "../../../../../../../../"
echo ${PWD}

function seed_json {
    sed -e "s/\${KEY}/$1/" \
        explorer/test-network-template.json
}

echo "$(seed_json $FILES)" > explorer/connection-profile/test-network.json
