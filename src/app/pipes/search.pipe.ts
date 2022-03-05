import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(AllUser: any[], searchTerm: any): any {
    if(searchTerm==undefined)
    {
      return AllUser;
    }
    else{
      return AllUser.filter(x=>x['userName'].toLowerCase().indexOf(searchTerm.toLowerCase())!==-1);
    }
  }

}
