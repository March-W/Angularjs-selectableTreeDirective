class opPolicyIpSetsEditCtrl {
    /*@ngInject*/
    constructor($scope, opPolicyIpSetsService) {
        this.$scope = $scope;
        this.opPolicyIpSetsService = opPolicyIpSetsService;
        
        this.formData = {
        name: '',
        desc: '',
        source_ips: [],
        source_countries: [],
        enable_country: 1
        };
        this.editSourceCountry = [];
        this.show_countries = false;
        this.loading = false;
        this.result = {
        errno: 0,
        errmsg: ''
        };
        
        this.init();
    }
    
    init() {
        console.log(this.itemData);
        if (this.editType == 'edit' && this.itemData.source_ips) {
            this.itemData.source_ips = this.itemData.source_ips.join('\n');
        }
        if (this.editType == 'edit') {
            this.editSourceCountry = this.itemData.source_countries;
        }
        this.itemData.enable_country = Boolean(this.itemData.enable_country);
        this.formData = Object.assign(this.formData, this.itemData);
    }
    
    onEditIPSetsClick(ev) {
        this.show_countries = false;
        
        ev.stopPropagation();
    }
    
    onCheckChange(params) {
        this.formData.source_countries = params.data;
    }
    
    onCancelClick() {
        this.cancelClick && this.cancelClick({});
    }
    
    onSaveClick() {
        //need to optimize
        if (typeof(this.formData.source_ips)=='string' && this.formData.source_ips.length) {
            this.formData.source_ips = this.formData.source_ips.replace(/\n/g, ",");
        }
        if (this.formData.source_countries.constructor === Object && this.formData.source_countries) {
            this.formData.source_countries = Object.keys(this.formData.source_countries);
        }
        this.formData.enable_country = Number(this.formData.enable_country);
        
        const params = Object.assign({}, this.formData);
        console.log(params);
        this.loading = true;
        this.result = {
        errno: 0,
        errmsg: ''
        };
        this.saveRuleRequest(params).then(data => {
                                          this.loading = false;
                                          Object.assign(this.result, data);
                                          if (data.errno === 0) {
                                          this.saveClick && this.saveClick({});
                                          } else {
                                          this.reEditSave();
                                          }
                                          });
    }
    
    reEditSave() {
        if (this.formData.source_ips && this.formData.source_ips.length) {
            this.formData.source_ips = this.formData.source_ips.replace(/,/g, "\n");
        }
        // if (this.formData.source_countries && this.formData.source_countries.length && this.editType == 'edit') {
        //     this.formData.source_countries = this.itemData.source_countries;
        // }
        this.formData.enable_country = Boolean(this.formData.enable_country);
    }
    
    saveRuleRequest(params) {
        return this.editType === 'add'
        ? this.opPolicyIpSetsService.addIPSetsRule(params)
        : this.opPolicyIpSetsService.updateIPSetsRule(
                                                      params,
                                                      this.formData.ipset_id,
                                                      this.itemData.profile.length > 0 ? true : false,
                                                      );
    }
}

class opPolicyIpSetsEdit {
    /*@ngInject*/
    constructor() {
        this.templateUrl = 'views/cleanpipe/policy/template/ipSets/ipSetsItemEdit.html';
        this.restrict = 'E';
        this.controller = opPolicyIpSetsEditCtrl;
        this.controllerAs = 'vm';
        this.bindToController = true;
        // this.transclude =true;
        this.scope = {
        itemData: '=',
        itemIndex: '=',
        editType: '=',
        saveClick: '&',
        cancelClick: '&'
        };
    }
}

angular
.module('speAdminApp')
.directive('opPolicyIpSetsEdit', () => new opPolicyIpSetsEdit());

