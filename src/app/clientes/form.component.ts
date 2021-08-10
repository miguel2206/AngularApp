import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2'

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public cliente:Cliente = new Cliente()
  public titulo:string = "Crear Cliente"

  public errores: string[];

  constructor(private clienteService: ClienteService,
  private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
  }

  // Method "cargar cliente": permite obtener los datos de un cliente por su id
  cargarCliente():void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe( (cliente) => this.cliente = cliente)
      }
    })
  }

  // Method "create": permite agregar un cliente
  public create(): void {
    // Invocar el método crear desde el service
    this.clienteService.create(this.cliente)
    // Redirigir a la página clientes y mostrar una alerta de success
    .subscribe(
      // Si todo sale bien...
      cliente => {
        this.router.navigate(['/clientes'])
        swal.fire('Nuevo cliente', `El cliente ${cliente.nombre} ha sido creado con éxito`, 'success')
      },
      // Si algo sale mal...
      err => {
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    );
  }

  // Method "update"
  update(): void{
    this.clienteService.update(this.cliente)
    .subscribe(
      // Si todo sale bien...
      json => {
        this.router.navigate(['/clientes'])
        swal.fire('Cliente Actualizado', `${json.mensaje}: ${json.cliente.nombre}`, 'success')
      },
      // Si algo sale mal...
      err => {
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    );
  }
}
