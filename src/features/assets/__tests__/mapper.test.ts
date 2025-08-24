import 'reflect-metadata';
import { createId } from '@paralleldrive/cuid2';
import { Asset as AssetEntity } from '@prisma/client';

import { Asset, toDomain, toEntity } from '@/features/assets';

describe('toDomain', () => {
  it('should map an AssetEntity to an Asset domain object', () => {
    const entity: AssetEntity = {
      id: createId(),
      fileName: 'entity-file.txt',
      filePath: 'path/to/entity-file.txt',
    };

    const domain = toDomain(entity);

    expect(domain).toBeInstanceOf(Asset);
    expect(domain.id.value).toBe(entity.id);
    expect(domain.name.value).toBe(entity.fileName);
    expect(domain.path.value).toBe(entity.filePath);
  });
});

describe('toEntity', () => {
  it('should map an Asset domain object to an AssetEntity', () => {
    const domain = new Asset({
      id: createId(),
      name: 'domain-file.png',
      path: 'path/to/domain-file.png',
    });

    const entity = toEntity(domain);

    const expectedEntity: AssetEntity = {
      id: domain.id.value,
      fileName: domain.name.value,
      filePath: domain.path.value,
    };

    expect(entity).toEqual(expectedEntity);
  });
});
