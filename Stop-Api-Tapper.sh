#!/bin/bash

kubectl scale -n apiclarity deployment apiclarity-apiclarity --replicas=0
