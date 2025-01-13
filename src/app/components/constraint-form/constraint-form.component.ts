import { Component } from '@angular/core';
import { OpenAIService } from '../../services/openai.service';
import { JsonParserService } from '../../services/json-parser.service';

@Component({
  selector: 'app-constraint-form',
  templateUrl: './constraint-form.component.html',
  styleUrl: './constraint-form.component.css'
})
export class ConstraintFormComponent {
  userMessage: string = '';
  generatedConstraint: string = '';

  // Sample JSON data (This could be fetched from a backend or static file)
  jsonData = `{
    "Heatsink and Accessories": [
      {
        "KeyWord": "ClosedLoopLiquidCooling",
        "Product": "P74800-B21",
        "RuleNumber": "20",
        "PARENT_CLASS_NEW": "HeatSinkKit"
      },
      {
        "KeyWord": "DLCModule",
        "Product": "P74208-B21",
        "RuleNumber": "20",
        "PARENT_CLASS_NEW": "HeatSinkKit"
      }
    ]
  }`;

  constructor(
    private openAIService: OpenAIService,
    private jsonParserService: JsonParserService
  ) {}

  generateConstraint(): void {
    const parsedData = this.jsonParserService.parseJson(this.jsonData);
    if (!parsedData) return;

    const prompt = this.createPrompt(parsedData, this.userMessage);

    // Call OpenAI service to generate the constraint
    this.openAIService.generateConstraint(prompt).subscribe((response: { choices: { message: { content: string; }; }[]; }) => {
      this.generatedConstraint = response.choices[0].message.content;
    });
  }

  createPrompt(jsonData: any, userMessage: string): string {
    return `You are an expert in writing logical constraint rules. Your task is to generate a constraint rule based on the following data:

    JSON Data:
    ${JSON.stringify(jsonData, null, 2)}

    User Message:
    "${userMessage}"

    Generate a valid constraint rule dynamically.`;
  }
}

