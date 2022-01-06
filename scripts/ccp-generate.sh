#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s/\${ORGDOMAIN}/$4/"\
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ./ccp-template.json
}

function yaml_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s/\${ORGDOMAIN}/$4/"\
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ./ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

ORG="DoctorDepartment"
ORGDOMAIN="doctor"
P0PORT=7051
CAPORT=7054
PEERPEM=../consortium/organizations/peerOrganizations/doctor.hospital-network.com/tlsca/tlsca.doctor.hospital-network.com-cert.pem
CAPEM=../consortium/organizations/peerOrganizations/doctor.hospital-network.com/ca/ca.doctor.hospital-network.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $ORGDOMAIN $PEERPEM $CAPEM)" > organizations/peerOrganizations/doctor.hospital-network.com/connection-doctor.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $ORGDOMAIN $PEERPEM $CAPEM)" > organizations/peerOrganizations/doctor.hospital-network.com/connection-doctor.yaml

ORG="LaboratoryDepartment"
ORGDOMAIN="lab"
P0PORT=9051
CAPORT=8054
PEERPEM=../consortium/organizations/peerOrganizations/lab.hospital-network.com/tlsca/tlsca.lab.hospital-network.com-cert.pem
CAPEM=../consortium/organizations/peerOrganizations/lab.hospital-network.com/ca/ca.lab.hospital-network.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $ORGDOMAIN $PEERPEM $CAPEM)" > ../consortium/organizations/peerOrganizations/lab.hospital-network.com/connection-lab.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $ORGDOMAIN $PEERPEM $CAPEM)" > ../consortium/organizations/peerOrganizations/lab.hospital-network.com/connection-lab.yaml