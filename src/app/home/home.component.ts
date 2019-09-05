import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../users.service';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    max = new Date().toJSON().slice(0, 10);
    contacto: FormGroup;
    submitted = false;
    titulo = 'registro';
    mEdad: boolean;
    existe = 0;
    merror: boolean;
    constructor(private formBuilder: FormBuilder, private service: UsersService, public ruter: Router) { }

    ngOnInit() {
        this.contacto = this.formBuilder.group({
            // tslint:disable-next-line: max-line-length
            identificacion: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10), Validators.pattern(/^[1-9]\d{6,10}$/)]],
            nya: ['', Validators.required],
            Fechadenacimiento: ['', [Validators.required]]
        });
    }

    get f() { return this.contacto.controls; }
    onSubmit() {
        this.submitted = true;
        if (this.contacto.invalid) {
            return;
        }
        const fecha = this.contacto.controls.Fechadenacimiento.value;
        const identificacion = this.contacto.controls.identificacion.value;
        const nombres = this.contacto.controls.nya.value;

        const data = {
            Identificacion: identificacion,
            Nombres: nombres,
            FechaNacimiento: fecha
        };

        if (this.calcularEdad()) {
            this.service.envio(data)
                .then(res => {
                    // Violation of PRIMARY KEY
                    try {
                        this.existe = res.data.message.indexOf('Violation of PRIMARY KEY');
                    } catch (error) {
                        this.existe = -1;
                    }
                    if (this.existe >= 0) {
                        this.merror = true;
                    } else {
                        console.log(res.data);
                        console.log(res.data.message);
                        this.ruter.navigate(['/credito/' + identificacion]);
                    }
                })
                .catch(err => alert(err));
        } else {
            this.mEdad = true;
            // console.log('error')
            // alert('No Cumples con la edad para solicitar un credito');
        }

    }
    calcularEdad() {
        const fecha = this.contacto.controls.Fechadenacimiento.value;
        const hoy = new Date();
        const cumpleanos = new Date(fecha);
        let edad = hoy.getFullYear() - cumpleanos.getFullYear();
        const m = hoy.getMonth() - cumpleanos.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
            edad--;
        }
        if (edad >= 18) {
            return true;
        }
        return false;
    }
}
