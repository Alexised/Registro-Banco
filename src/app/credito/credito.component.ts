import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../users.service';
import swal from 'sweetalert';

@Component({
    selector: 'app-credito',
    templateUrl: './credito.component.html',
    styleUrls: ['./credito.component.css']
})
export class CreditoComponent implements OnInit {
    credito: FormGroup;
    loading: boolean;
    submitted = false;
    titulo = 'Credito';
    ferror: boolean;
    serror: boolean;
    id: any = '';
    max = this.calcular();
    constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, public ruter: Router, private service: UsersService) {
        this.route.params.subscribe(res => this.id = res.id);

    }
    ngOnInit() {
        this.credito = this.formBuilder.group({
            // tslint:disable-next-line: max-line-length
            Nit: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(11), Validators.pattern(/^[1-9]+\d{6,11}$/)]],
            NombreEmpresa: ['', Validators.required],
            FechaIngreso: ['', [Validators.required]],
            Salario: ['', [Validators.required, Validators.pattern(/^[1-9]+/)]]
        });
    }
    get f() { return this.credito.controls; }
    onSubmit() {
        this.submitted = true;
        if (this.credito.invalid) {
            return;
        }
        const Nit = this.credito.controls.Nit.value;
        const NombreEmpresa = this.credito.controls.NombreEmpresa.value;
        const FechaIngreso = this.credito.controls.FechaIngreso.value;
        const Salario = this.credito.controls.Salario.value.replace(/\./g, '');
        const data = {
            NombreEmpresa: NombreEmpresa,
            NIT: Nit,
            salario: Salario,
            fechaIngreso: FechaIngreso,
            Identificacion: this.id,
        };
        console.log(data);
        if (this.calcularFecha()) {
            this.service.enviocredito(data)
                .then(res => {
                    this.montoaprovado();
                    this.loading=true;
                })
                .catch(err => alert(err));
        } else {
            this.ferror = true;
        }
    }
    montoaprovado() {
        const num = this.credito.controls.Salario.value.replace(/\./g, '');
        const FechaIngreso = this.credito.controls.FechaIngreso.value;
        const date = new Date();
        date.setMonth(date.getMonth() - 18);
        const fechatrabajo = date.toJSON().slice(0, 10);
        const dateEnd = new Date(FechaIngreso);
        console.log(date);
        if (date >= dateEnd) {
            console.log('true');
        } else {
            console.log('false');
        }
        if (num <= 800000 || date < dateEnd) {
            swal("Oops", 'No es posible aprobar el credito', "error")
        } else if (num > 800000 && num <= 4000000) {
            swal({
                title: "Aprovado!",
                text: "Credito por valor de 20.000.000",
                icon: "success",
            });
        } else if (num > 4000000) {
            swal({
                title: "Aprovado!",
                text: "Credito por valor de 50.000.000",
                icon: "success",
            });
        }
    }
    calcular() {
        let hoy = new Date();
        const ayer = hoy.setDate(hoy.getDate() - 1);
        hoy = new Date(ayer);
        const max = hoy.toJSON().slice(0, 10);
        return max;
    }
    calcularFecha() {
        let fecha = this.credito.controls.FechaIngreso.value;
        let hoy = new Date();
        const ayer = hoy.setDate(hoy.getDate() - 1);
        hoy = new Date(ayer);
        fecha = new Date(fecha);
        const max = hoy.toJSON().slice(0, 10);
        if (fecha > hoy) {
            return false;
        } else {
            return true;
        }

    }
    format(input) {

        let num = input.value.replace(/\./g, '');
        if (!isNaN(num)) {
            num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
            num = num.split('').reverse().join('').replace(/^[\.]/, '');
            input.value = num;
            console.log(num);
            num = num.replace(/\./g, '');
            if (num > 100000000) {
                input.value = null;
                this.serror = true;
            }
        } else {

            input.value = input.value.replace(/[^\d\.]*/g, '');
        }
    }

}
