import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './todosList.html';
import { Tasks } from '../../api/tasks.js';

class TodosListCtrl {
  // constructor() {
  //   this.tasks = [{
  //     text: 'This is task 1'
  //   }, {
  //     text: 'This is task 2'
  //   }, {
  //     text: 'This is task 3'
  //   }];
  // }
  constructor($scope) {
    $scope.viewModel(this);
 
    this.helpers({
      tasks() {
        return Tasks.find({});
      }
    })
  }
}
 
export default angular.module('todosList', [
  angularMeteor
])
  .component('todosList', {
    templateUrl: 'imports/components/todosList/todosList.html',
    controller: ['$scope', TodosListCtrl]
  });