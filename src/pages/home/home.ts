import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Carro } from '../../modelos/carro';
import { HttpErrorResponse } from '@angular/common/http';
import { CarrosServiceProvider } from '../../providers/carros-service/carros-service';
import { NavLifecycles } from '../../utils/ionic/nav/nav-lifecycles';
import { EscolhaPage } from '../escolha/escolha';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements NavLifecycles {

  public carros=[];
  public numItems = 0;
  public incremento = 5;
  aux = [];
  constructor(public navCtrl: NavController,
     private _loadingController: LoadingController,
     private _alertController: AlertController,
     private _carrosService: CarrosServiceProvider) {}

  ionViewDidLoad() {
    let loading = this._loadingController.create({
      content: 'Carregando carros...'
    });

    loading.present();

    this._carrosService.lista().subscribe(
      (carros) => {
        this.aux = carros;
        this.numItems = this.incremento;
        for(var x = 0; x<this.numItems; x++){
          if(carros[x] != null){
            this.carros[x] = carros[x];
          } else {
            break;
          }
        }
        loading.dismiss();
      },
                (err: HttpErrorResponse) => {
                  console.log(err);

                  loading.dismiss();

                  this._alertController.create( {
                    title: 'Falha na conexão',
                    subTitle: 'Não foi possível carregar a lista de carros. Tente novamente mais tarde!',
                    buttons: [
                      { text: 'Ok' }
                    ]
                  } ).present();
                }
              );
  }

  selecionaCarro(carro: Carro) {
    console.log(carro);
    this.navCtrl.push(EscolhaPage.name, {
      carroSelecionado: carro
    });
  }

  load(event){
    console.log(this.aux.length);
    if(this.numItems > this.aux.length){
      event.complete();
      return
    }
    this.numItems+=5;
    
    setTimeout(() => {
      for(var x = 0; x<this.numItems; x++){
        if(this.aux[x] != null){
          this.carros[x] = this.aux[x];
        } else {
          break
        }
      }

      event.complete();
    },700);
    console.log(event);
  }

}
