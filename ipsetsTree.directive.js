class ipsetsTreeModuleCtrl {
    /*@ngInject*/
    constructor($scope, opPolicyIpSetsService) {
        this.$scope = $scope;
        this.opPolicyIpSetsService = opPolicyIpSetsService;
        
        this.searchField = '';
        this.editIPSetsTreeData = [];
        this.ipsetsTreeDataCopy = [];
        this.loadingCountry = false;
        this.sourceCountryCount = 0;
        this.copyIpsetsTreeData = true;
        
        this.editIPSetsTreeData = Object.keys(this.editSourceCountry);
    }
    
    initIpsetsTreeData(source) {
        this.editIPSetsTreeData = Object.keys(this.editSourceCountry);
        if (this.copyIpsetsTreeData) {
            this.ipsetsTreeDataCopy = source;
            this.copyIpsetsTreeData = false;
        }
    }
    
    onShowCountriesClick(ev) {
        if (this.enableCountry) {
            this.showCountries = !this.showCountries;
            if (this.showCountries) {
                !this.ipsetsTreeData && this.getSourceCountry().then(data => {});
            }
        } else {
            this.showCountries = false;
        }
        
        ev.stopPropagation();
    }
    
    getSourceCountry() {
        this.loadingCountry = true;
        return this.opPolicyIpSetsService
        .getSourceCountries()
        .then(data => {
              this.loadingCountry = false;
              this.ipsetsTreeData = data;
              this.sourceCountryCount = Object.keys(data).length;
              });
    }
    
    changeKeyValue(value) {
        value = value.toLowerCase();
        let newData = {};
        
        for (let i in this.ipsetsTreeData) {
            if (this.ipsetsTreeData[i].toLowerCase().includes(value)) {
                newData[i] = this.ipsetsTreeData[i];
            }
        }
        if (value != '' && Object.keys(newData).length != 0) {
            this.ipsetsTreeData = newData;
        } else {
            this.ipsetsTreeData = this.ipsetsTreeDataCopy;
        }
    }
    
    searchCountry() {}
    onInputClick(ev) {
        ev.stopPropagation();
    }
    
    onCountrySelectAllClick(ev) {
        if (this.editIPSetsTreeData.length < this.sourceCountryCount) {
            this.editIPSetsTreeData = Object.keys(this.ipsetsTreeData);
        } else {
            this.editIPSetsTreeData = [];
        }
        this.checkChange && this.checkChange({params: {data: this.editIPSetsTreeData}});
        
        ev.stopPropagation();
    }
    
    onCountryItemClick(country, ev) {
        const idx = this.editIPSetsTreeData.indexOf(country);
        if (idx > -1) {
            this.editIPSetsTreeData.splice(idx, 1);
        } else {
            this.editIPSetsTreeData.push(country);
        }
        this.checkChange && this.checkChange({params: {data: this.editIPSetsTreeData}});
        
        ev.stopPropagation();
    }
}
class ipsetsTreeModule {
    constructor() {
        this.templateUrl = 'views/cleanpipe/policy/template/ipSets/ipSetsTreeModule.html';
        this.restrict = 'E';
        this.controller = ipsetsTreeModuleCtrl;
        this.controllerAs = 'vm';
        this.bindToController = true;
        // this.transclude =true;
        this.scope = {
        editSourceCountry: '=',
        enableCountry: '=',
        showCountries: '=',
        checkChange: '&',
        };
    }
    
    link(scope) {
        scope.$watch('vm.allChecked', (newData, oldData) => {
                     if (newData && newData != oldData) {
                     scope.vm.setAllChecked(newData);
                     }
                     });
        scope.$watch('vm.ipsetsTreeData', (newData, oldData) => {
                     if (scope.vm.ipsetsTreeData && Object.keys(scope.vm.ipsetsTreeData).length > 0) {
                     scope.vm.initIpsetsTreeData(scope.vm.ipsetsTreeData);
                     }
                     });
    }
}

angular
.module('speAdminApp')
.directive('ipsetsTreeModule', () => new ipsetsTreeModule());

