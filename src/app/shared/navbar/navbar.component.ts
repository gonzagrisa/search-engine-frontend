import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faBackward, faSignOutAlt, faUsers, IconDefinition, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { UserResourceService } from 'src/app/api/resources/user-resource.service';
import { AuthService } from 'src/app/services/auth.service';

interface ILink {
  link: string;
  text: string;
  icon?: IconDefinition;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  authLinks: ILink[] = [
    {
      link: '/login',
      text: '🔑 Iniciar Sesión'
    },
    {
      link: '/signup',
      text: '✎ Crear Cuenta'
    }
  ];

  commonLinks: ILink[] = [
    {
      link: '/dashboard',
      text: '📋 Dashboard',
    },
    {
      link: '/profile',
      text: '📃 Perfil',
    }
  ];

  userLinks: ILink[] = [
    ...this.commonLinks,
    {
      link: '/websites',
      text: '📰 Páginas Web'
    },
    {
      link: '/services',
      text: 'Servicios',
      icon: faPaperPlane
    }
  ];

  adminLinks: ILink[] = [
    ...this.commonLinks,
    {
      link: '/users',
      text: 'Usuarios',
      icon: faUsers
    }
  ];

  faUsers = faUsers;
  faLogOut = faSignOutAlt;
  faBackwards = faBackward;
  faPaperPlane = faPaperPlane;

  links: ILink[];

  constructor(public auth: AuthService,
              private router: Router,
              private api: UserResourceService) {
  }

  ngOnInit(): void {
    this.auth.role$.subscribe((role) => this.updateLinks(role));
  }

  updateLinks(role: string): void {
    if (role == null) {
      this.links = this.authLinks;
    } else if (role === 'ADMIN') {
      this.links = this.adminLinks;
    } else {
      this.links = this.userLinks;
    }
  }

  logOut(): void {
    this.auth.deleteToken();
    this.router.navigate(['']);
  }

  returnAccount(): void {
    const id = this.auth.getDecodedToken()['impersonator'];
    this.api.returnAccount({ id }).subscribe(
      (res) => {
        this.auth.setToken(res);
        this.router.navigate(['dashboard']);
      }
    );
  }
}
