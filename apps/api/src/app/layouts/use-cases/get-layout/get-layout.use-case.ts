import { Injectable, NotFoundException } from '@nestjs/common';
import { LayoutEntity, LayoutRepository } from '@novu/dal';

import { GetLayoutCommand } from './get-layout.command';

import { LayoutDto } from '../../dtos';
import { IEmailBlock, ITemplateVariable } from '../../types';

@Injectable()
export class GetLayoutUseCase {
  constructor(private layoutRepository: LayoutRepository) {}

  async execute(command: GetLayoutCommand): Promise<LayoutDto> {
    const layout = await this.layoutRepository.findOne({
      _id: LayoutRepository.convertStringToObjectId(command.layoutId),
      _environmentId: LayoutRepository.convertStringToObjectId(command.environmentId),
    });

    if (!layout) {
      throw new NotFoundException(
        `Layout not found for id ${command.layoutId} in the environment ${command.environmentId}`
      );
    }

    return this.mapFromEntity(layout);
  }

  private mapFromEntity(layout: LayoutEntity): LayoutDto {
    return {
      ...layout,
      _id: LayoutRepository.convertObjectIdToString(layout._id),
      _organizationId: LayoutRepository.convertObjectIdToString(layout._organizationId),
      _environmentId: LayoutRepository.convertObjectIdToString(layout._environmentId),
      variables: this.mapVariablesFromEntity(layout.variables),
      isDeleted: layout.deleted,
    };
  }

  private mapVariablesFromEntity(variables?: ITemplateVariable[]): ITemplateVariable[] {
    if (!variables || variables.length === 0) {
      return [];
    }

    return variables.map((variable) => {
      const { name, type, defaultValue, required } = variable;

      return {
        name,
        type,
        defaultValue,
        required,
      };
    });
  }

  private mapContentFromEntity(blocks: IEmailBlock[]): IEmailBlock[] {
    return blocks.map((block) => {
      const { content, type, url } = block;

      return {
        content,
        type,
        ...(url && { url }),
      };
    });
  }
}
