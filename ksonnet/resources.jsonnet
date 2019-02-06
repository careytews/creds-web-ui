
// Import KSonnet library.
local k = import "ksonnet.beta.2/k.libsonnet";

// Short-cuts to various objects in the KSonnet library.
local depl = k.extensions.v1beta1.deployment;
local container = depl.mixin.spec.template.spec.containersType;
local containerPort = container.portsType;
local mount = container.volumeMountsType;
local volume = depl.mixin.spec.template.spec.volumesType;
local resources = container.resourcesType;
local svc = k.core.v1.service;
local svcPort = svc.mixin.spec.portsType;
local svcLabels = svc.mixin.metadata.labels;
local svcType = svc.mixin.spec.type;

local credsWebUi(config) = {

    local version = import "version.jsonnet",

    name: "creds-web-ui",
    images: [config.containerBase + "/creds-web-ui:" + version],

    // Ports used by deployments
    local ports = [
        containerPort.newNamed("http", 8080)
    ],

    // Volume mount points
    local volumeMounts = [
    ],

    // Container definition.
    local containers = [
        container.new("creds-web-ui", self.images[0]) +
            container.ports(ports) +
            container.volumeMounts(volumeMounts) +
            container.mixin.resources.limits({
                memory: "32M", cpu: "0.3"
            }) +
            container.mixin.resources.requests({
                memory: "32M", cpu: "0.05"
            })
    ],

    // Deployment definition.  id is the node ID.
    deployments: [
        depl.new("creds-web-ui", 1, containers,
                 {app: "creds-web-ui", component: "frontend"}) +
            depl.mixin.metadata.namespace(config.namespace)
    ],

    // Ports declared on the service.
    local servicePorts = [
        svcPort.newNamed("http", 8080, 8080) + svcPort.protocol("TCP")
    ],

    services: [

        // One service
        svc.new("creds-web-ui", {app: "creds-web-ui"}, servicePorts) +

            // Label
            svcLabels({app: "creds-web-ui", component: "frontend"}) +
            
            svc.mixin.metadata.namespace(config.namespace)

    ],

    resources:
        if config.options.includeCredentialSvc then
            self.deployments + self.services
        else []

};

[credsWebUi]
