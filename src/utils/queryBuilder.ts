/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IQueryConfig,
  IQueryParams,
  PrismaCountArgs,
  PrismaFindManyArgs,
  PrismaModelDelegate,
  PrismaNumberFilter,
  PrismaStringFilter,
  PrismaWhereCondition,
} from "../interfaces/queryBuilder.interface";

export class queryBuilder<
  T,
  TWhereInput = Record<string, unknown>,
  TInclude = Record<string, unknown>,
> {
  private query: PrismaFindManyArgs;
  private countQuery: PrismaCountArgs;
  private page: number = 1;
  private limit: number = 10;
  private skip: number = 0;
  private sortBy: string = "createdAt";
  private sortOrder: "asc" | "desc" = "desc";
  private selectFields: Record<string, boolean> | undefined;

  constructor(
    private model: PrismaModelDelegate,
    private queryParams: IQueryParams,
    private config: IQueryConfig = {},
  ) {
    this.query = {
      where: {},
      include: {},
      orderBy: {},
      skip: 0,
      take: 10,
    };

    this.countQuery = {
      where: {},
    };
  }

  search(): this {
    const { searchTerm } = this.queryParams;
    const { searchableFields } = this.config;

    if (searchTerm && searchableFields && searchableFields.length > 0) {
      const searchCondition: Record<string, unknown>[] = searchableFields.map(
        (field) => {
          if (field.includes(".")) {
            const parts = field.split(".");

            if (parts.length === 2) {
              const [relation, nestedField] = parts;

              const stringFilter: PrismaStringFilter = {
                contains: searchTerm,
                mode: "insensitive" as const,
              };

              return {
                [relation!]: {
                  [nestedField!]: stringFilter,
                },
              };
            } else if (parts.length === 3) {
              const [relation, nestedRelation, nestedField] = parts;

              const stringFilter: PrismaStringFilter = {
                contains: searchTerm,
                mode: "insensitive" as const,
              };

              return {
                [relation!]: {
                  some: {
                    [nestedRelation!]: {
                      [nestedField!]: stringFilter,
                    },
                  },
                },
              };
            } else {
              const stringFilter: PrismaStringFilter = {
                contains: searchTerm,
                mode: "insensitive" as const,
              };

              return {
                [field]: stringFilter,
              };
            }
          } else {
            const stringFilter: PrismaStringFilter = {
              contains: searchTerm,
              mode: "insensitive" as const,
            };
            return {
              [field]: stringFilter,
            };
          }
        },
      );
      const whereCondition = this.query.where as PrismaWhereCondition;
      whereCondition.OR = searchCondition;

      const countWhereCondition = this.countQuery.where as PrismaWhereCondition;
      countWhereCondition.OR = searchCondition;
    }

    return this;
  }

  filter(): this {
    const { filterableFields } = this.config;

    const excludedFields = [
      "searchTerm",
      "page",
      "limit",
      "sortBy",
      "sortOrder",
      "fields",
      "include",
    ];

    const filterParams: Record<string, unknown> = {};

    Object.keys(this.queryParams).forEach((key) => {
      if (!excludedFields.includes(key)) {
        filterParams[key] = this.queryParams[key];
      }
    });

    const queryWhere = this.query.where as Record<string, unknown>;
    const countQueryWhere = this.countQuery.where as Record<string, unknown>;

    Object.keys(filterParams).forEach((key) => {
      const value = filterParams[key];

      if (value === null || value === undefined || value === "") {
        return;
      }

      const isAllowed =
        !filterableFields ||
        filterableFields.length === 0 ||
        filterableFields.includes(key);

      if (key.includes(".")) {
        const parts = key.split(".");

        if (filterableFields && !filterableFields.includes(key)) {
          return;
        }

        if (parts.length === 2) {
          const [relation, nestedField] = parts;

          if (!queryWhere[relation!]) {
            queryWhere[relation!] = {};
          }

          if (!countQueryWhere[relation!]) {
            countQueryWhere[relation!] = {};
          }

          const queryRelation = queryWhere[relation!] as Record<
            string,
            unknown
          >;
          const countRelation = countQueryWhere[relation!] as Record<
            string,
            unknown
          >;

          queryRelation[nestedField!] = this.parseFilterValue(value);
          countRelation[nestedField!] = this.parseFilterValue(value);

          return;
        } else if (parts.length === 3) {
          const [relation, nestedRelation, nestedField] = parts;

          if (!queryWhere[relation!]) {
            queryWhere[relation!] = {
              some: {},
            };
          }

          if (!countQueryWhere[relation!]) {
            countQueryWhere[relation!] = {
              some: {},
            };
          }

          const queryRelation = queryWhere[relation!] as Record<
            string,
            unknown
          >;
          const countRelation = countQueryWhere[relation!] as Record<
            string,
            unknown
          >;

          if (!queryRelation.some) {
            queryRelation.some = {};
          }

          if (!countRelation.some) {
            countRelation.some = {};
          }

          const querySome = queryRelation.some as Record<string, unknown>;
          const countSome = countRelation.some as Record<string, unknown>;

          if (!querySome[nestedRelation!]) {
            querySome[nestedRelation!] = {};
          }

          if (!countSome[nestedRelation!]) {
            countSome[nestedRelation!] = {};
          }

          const queryNestedRelation = querySome[nestedRelation!] as Record<
            string,
            unknown
          >;
          const countNestedRelation = countSome[nestedRelation!] as Record<
            string,
            unknown
          >;

          queryNestedRelation[nestedField!] = this.parseFilterValue(value);
          countNestedRelation[nestedField!] = this.parseFilterValue(value);

          return;
        }
      }

      if (!isAllowed) {
        return;
      }

      if (
        typeof value === "object" &&
        !Array.isArray(value) &&
        value !== null
      ) {
        queryWhere[key] = this.parseRangeFilter(
          value as Record<string, string | number>,
        );
        countQueryWhere[key] = this.parseRangeFilter(
          value as Record<string, string | number>,
        );

        return;
      }

      queryWhere[key] = this.parseFilterValue(value);
      countQueryWhere[key] = this.parseFilterValue(value);
    });

    return this;
  }

  paginate(): this {
    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || 10;

    this.page = page;
    this.limit = limit;
    this.skip = (page - 1) * limit;

    this.query.skip = this.skip;
    this.query.take = this.limit;

    return this;
  }

  sort(): this {
    const sortBy = this.queryParams.sortBy as string;
    const sortOrder = this.queryParams.sortOrder === "asc" ? "asc" : "desc";

    this.sortBy = sortBy;
    this.sortOrder = sortOrder;

    if (sortBy.includes(".")) {
      const parts = sortBy.split(".");

      if (parts.length === 2) {
        const [relation, nestedField] = parts;

        this.query.orderBy = {
          [relation!]: {
            [nestedField!]: sortOrder,
          },
        };
      } else if (parts.length === 3) {
        const [relation, nestedRelation, nestedField] = parts;

        this.query.orderBy = {
          [relation!]: {
            [nestedRelation!]: {
              [nestedField!]: sortOrder,
            },
          },
        };
      } else {
        this.query.orderBy = {
          [sortBy]: sortOrder,
        };
      }
    } else {
      this.query.orderBy = {
        [sortBy]: sortOrder,
      };
    }

    return this;
  }

  fields(): this {
    const fieldParams = this.queryParams.fields as string;

    if (fieldParams && typeof fieldParams === "string") {
      const fieldsArray = fieldParams.split(",").map((field) => field.trim());
      this.selectFields = {};

      fieldsArray.forEach((field) => {
        if (this.selectFields) {
          this.selectFields[field] = true;
        }
      });

      this.query.select = this.selectFields as Record<
        string,
        boolean | Record<string, unknown>
      >;

      delete this.query.include;
    }

    return this;
  }

  private parseFilterValue(value: unknown): unknown {
    if (value === "true") {
      return true;
    }

    if (value === "false") {
      return false;
    }

    if (typeof value === "string" && !isNaN(Number(value)) && value != "") {
      return Number(value);
    }

    if (Array.isArray(value) && value.length > 0) {
      return { in: value.map((item) => this.parseFilterValue(item)) };
    }
  }

  private parseRangeFilter(
    value: Record<string, string | number>,
  ): PrismaStringFilter | PrismaNumberFilter | Record<string, unknown> {
    const rangeQuery: Record<string, string | number | (string | number)[]> =
      {};

    Object.keys(value).forEach((operator) => {
      const operatorValue = value[operator];

      const parsedValue: string | number =
        typeof operatorValue === "string" &&
        !isNaN(Number(operatorValue)) &&
        operatorValue != ""
          ? (Number(operatorValue) as number)
          : (operatorValue as string);

      switch (operator) {
        case "contains":
        case "startsWith":
        case "endsWith":
        case "equals":
        case "lt":
        case "lte":
        case "gt":
        case "gte":
        case "not":
          rangeQuery[operator] = parsedValue;
          break;
        case "in":
        case "notIn":
          if (Array.isArray(operatorValue)) {
            rangeQuery[operator] = operatorValue;
          } else {
            rangeQuery[operator] = parsedValue;
          }
          break;
        default:
          break;
      }
    });

    return Object.keys(rangeQuery).length > 0 ? rangeQuery : value;
  }
}
