import { query } from '../config/db';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Generic helper for paginated queries
 */
export async function listPaginated<T>(
  tableName: string,
  params: PaginationParams,
  options: {
    where?: string;
    whereValues?: any[];
    orderBy?: string;
  } = {}
): Promise<PaginatedResult<T>> {
  const { page, limit } = params;
  const offset = (page - 1) * limit;
  const { where, whereValues = [], orderBy = 'created_at DESC' } = options;

  const whereClause = where ? `WHERE ${where}` : '';
  
  // Get total count
  const countSql = `SELECT COUNT(*) as total FROM ${tableName} ${whereClause}`;
  const countResult = await query(countSql, whereValues);
  const total = parseInt(countResult.rows[0].total);

  // Get data
  const dataSql = `
    SELECT * FROM ${tableName} 
    ${whereClause} 
    ORDER BY ${orderBy} 
    LIMIT $${whereValues.length + 1} OFFSET $${whereValues.length + 2}
  `;
  const dataResult = await query(dataSql, [...whereValues, limit, offset]);

  return {
    data: dataResult.rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
