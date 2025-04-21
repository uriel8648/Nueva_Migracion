import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

/**
 * HeaderComponent
 * 
 * This component handles the application header section with navigation functionality.
 * It contains the navigation bar and jumbotron that appears at the top of the application.
 * 
 * Features:
 * - Responsive navigation bar
 * - Application branding and description
 * - Navigation methods using Angular Router
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  /** Application title displayed in the header */
  appTitle = 'Todo Application';
  
  /** Application description displayed in the jumbotron */
  appDescription = 'A simple todo app built with Java, Spring MVC, and Angular.';
  
  /** Base URL for the application from environment configuration */
  baseUrl: string = environment.baseUrl;

  /**
   * Constructor with dependency injection
   * @param router Angular Router service for navigation
   */
  constructor(private router: Router) { }

  /**
   * Lifecycle hook that is called after data-bound properties are initialized
   */
  ngOnInit(): void {
    // Component initialization logic if needed in the future
  }

  /**
   * Navigate to the todos list view
   * Uses Angular Router for client-side navigation
   */
  navigateToTodos(): void {
    this.router.navigate(['/todos']);
  }

  /**
   * Navigate to the home page
   * Uses Angular Router for client-side navigation
   */
  navigateToHome(): void {
    this.router.navigate(['/']);
  }
}