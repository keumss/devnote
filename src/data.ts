interface CheatSheetItem {
  id: string;
  title: string;
  description: string;
  code?: string;
  language?: string;
}

interface CheatSheetCategory {
  id: string;
  title: string;
  items: CheatSheetItem[];
}

interface NavSection {
  id: string;
  title: string;
  categories: CheatSheetCategory[];
}

const _navData: NavSection[] = [
  {
    id: 'sql',
    title: 'SQL (PostgreSQL)',
    categories: [
      {
        id: 'sql-part1',
        title: 'Part 1. 초급: 기초 문법 및 조회',
        items: [
          {
            id: 'sql-intro',
            title: 'SQL(PostgreSQL)이란?',
            description: 'SQL(Structured Query Language)은 관계형 데이터베이스에서 데이터를 관리, 조회, 수정하기 위해 사용하는 표준 언어입니다. PostgreSQL은 안정성, 확장성 그리고 표준 준수율이 높은 대표적인 오픈소스 관계형 데이터베이스(RDBMS)로, 대용량 트랜잭션과 복잡한 분석 쿼리 처리에 탁월한 성능을 발휘합니다. 기초부터 뷰, 인덱스 등 고급 기능까지 순차적으로 쿼리 문법을 정립할 수 있습니다.'
          },
          {
            id: 'sql-create-table',
            title: '테이블 만들기 (CREATE TABLE)',
            description: '데이터베이스에 새로운 테이블을 생성하고 컬럼의 데이터 타입을 지정합니다.',
            code: `CREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  username VARCHAR(50) NOT NULL,\n  age INT,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);`,
            language: 'sql'
          },
          {
            id: 'sql-select-orderby',
            title: '조회 및 정렬 (SELECT, ORDER BY)',
            description: '원하는 데이터를 가져오고 특정 컬럼을 기준으로 오름차순(ASC) 또는 내림차순(DESC) 정렬합니다.',
            code: `SELECT username, age \nFROM users \nORDER BY age DESC, username ASC;`,
            language: 'sql'
          },
          {
            id: 'sql-where-filter',
            title: '데이터 필터링 (WHERE, AND, OR)',
            description: '조건에 맞는 데이터만 추출하며, AND/OR 논리 연산자로 여러 조건을 조합할 수 있습니다.',
            code: `SELECT * FROM users \nWHERE age >= 20 AND username = 'Alice'\n   OR age < 10;`,
            language: 'sql'
          },
          {
            id: 'sql-like',
            title: '패턴 검색 (LIKE, %, _)',
            description: '특정 문자열이 포함된 데이터를 찾습니다. %는 임의의 문자(길이 무관), _는 단일 글자를 의미합니다.',
            code: `-- 'A'로 시작하는 사람 검색\nSELECT * FROM users WHERE username LIKE 'A%';\n\n-- 이름이 세 글자인 사람 중 마지막이 'm'인 경우 (ex. Sam, Tom)\nSELECT * FROM users WHERE username LIKE '__m';`,
            language: 'sql'
          },
          {
            id: 'sql-aggregates',
            title: '집계 함수 (MIN, MAX, AVG, SUM)',
            description: '데이터의 최소, 최대, 평균, 합계를 구합니다.',
            code: `SELECT \n  COUNT(*) as total_users,\n  AVG(age) as average_age,\n  MIN(age) as youngest,\n  MAX(age) as oldest,\n  SUM(point) as total_points\nFROM users;`,
            language: 'sql'
          },
          {
            id: 'sql-functions-math-string',
            title: '사칙연산 및 문자/숫자 다루기',
            description: '출력 시 컬럼값끼리 연산을 하거나 문자열 함수(CONCAT, UPPER 등) 및 숫자 함수(ROUND, CEIL 등)를 사용할 수 있습니다.',
            code: `-- 문자열 결합 및 대문자 변환\nSELECT UPPER(CONCAT(first_name, ' ', last_name)) AS full_name FROM users;\n\n-- 숫자 사칙연산 및 반올림\nSELECT ROUND(salary * 1.1, 2) AS increased_salary FROM employees;`,
            language: 'sql'
          },
          {
            id: 'sql-subquery',
            title: '서브쿼리 (Subquery)',
            description: '쿼리 안에 또 다른 쿼리를 중첩하여 사용합니다. WHERE 절이나 SELECT 절에서 활용 가능합니다.',
            code: `-- 평균 나이보다 나이가 많은 유저 검색\nSELECT * FROM users \nWHERE age > (SELECT AVG(age) FROM users);`,
            language: 'sql'
          },
          {
            id: 'sql-groupby',
            title: '그룹 통계 (GROUP BY)',
            description: '특정 컬럼 기준으로 데이터를 그룹화하여 집계합니다. 그룹화 후 필터링은 HAVING 절을 씁니다.',
            code: `SELECT department, COUNT(*) as emp_count, AVG(salary) \nFROM employees \nGROUP BY department\nHAVING COUNT(*) >= 5;`,
            language: 'sql'
          },
          {
            id: 'sql-case-when',
            title: '조건문 (CASE WHEN / IF)',
            description: '데이터 출력 시 조건에 따라 다른 값을 부여합니다. (PostgreSQL은 IF식보다 CASE WHEN식을 표준으로 사용합니다)',
            code: `SELECT username, age,\n  CASE \n    WHEN age >= 20 THEN 'Adult'\n    WHEN age >= 13 THEN 'Teenager'\n    ELSE 'Child'\n  END AS age_group\nFROM users;`,
            language: 'sql'
          }
        ]
      },
      {
        id: 'sql-part2',
        title: 'Part 2. 중급: 설계 및 데이터 결합',
        items: [
          {
            id: 'sql-constraints',
            title: '안전한 제약 조건 (Constraints)',
            description: '잘못된 데이터가 들어오지 못하도록 컬럼 규칙을 정합니다. (NOT NULL, UNIQUE, CHECK 등)',
            code: `CREATE TABLE products (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(100) UNIQUE NOT NULL,\n  price INT CHECK (price >= 0),\n  status VARCHAR(20) DEFAULT 'active'\n);`,
            language: 'sql'
          },
          {
            id: 'sql-foreign-key',
            title: '관계 설정 (Foreign Key)',
            description: '두 테이블을 연결하여 데이터 정합성을 유지합니다. (보통 3정규형 적용 시 분리된 테이블을 연결할 때 사용)',
            code: `CREATE TABLE orders (\n  order_id SERIAL PRIMARY KEY,\n  user_id INT REFERENCES users(id) ON DELETE CASCADE,\n  amount INT\n);`,
            language: 'sql'
          },
          {
            id: 'sql-inner-join',
            title: '테이블 결합 (INNER JOIN)',
            description: '두 테이블에서 공통으로 존재하는 데이터만 연결하여 가져옵니다.',
            code: `SELECT users.username, orders.amount \nFROM users\nINNER JOIN orders ON users.id = orders.user_id;`,
            language: 'sql'
          },
          {
            id: 'sql-outer-join',
            title: '외부 결합 (LEFT / RIGHT JOIN)',
            description: 'LEFT JOIN은 왼쪽 테이블의 모든 데이터를 유지하며, 우측에 매칭되는 값이 없으면 NULL을 반환합니다.',
            code: `-- 구매 이력이 없는 유저도 포함하여 목록 출력\nSELECT users.username, orders.order_id\nFROM users\nLEFT JOIN orders ON users.id = orders.user_id;`,
            language: 'sql'
          },
          {
            id: 'sql-insert',
            title: '데이터 입력 (INSERT)',
            description: '테이블에 새로운 데이터를 추가합니다. 여러 행을 한 번에 삽입할 수도 있습니다.',
            code: `INSERT INTO users (username, age) \nVALUES \n  ('John', 25),\n  ('Jane', 28)\nRETURNING *; -- Postgres 전용: 입력된 결과 즉시 확인`,
            language: 'sql'
          },
          {
            id: 'sql-update-delete',
            title: '수정 / 삭제 (UPDATE / DELETE)',
            description: '데이터를 변경하거나 지웁니다. WHERE 절을 꼭 써서 전체 데이터가 변경되는 것을 방지하세요.',
            code: `-- 수정\nUPDATE users SET age = 30 WHERE username = 'John';\n\n-- 삭제\nDELETE FROM users WHERE age < 10;`,
            language: 'sql'
          },
          {
            id: 'sql-union',
            title: '결과 합치기 (UNION)',
            description: '두 개 이상의 SELECT 결과를 위아래로 이어 붙입니다. UNION은 중복을 제거하고, UNION ALL은 모두 포함합니다.',
            code: `SELECT email FROM customers\nUNION ALL\nSELECT email FROM employees;`,
            language: 'sql'
          },
          {
            id: 'sql-view',
            title: '가상 테이블 (VIEW)',
            description: '복잡한 쿼리를 하나의 가상 테이블로 만들어 재사용성을 높입니다.',
            code: `-- 뷰 생성\nCREATE VIEW active_adult_users AS\nSELECT * FROM users WHERE status = 'active' AND age >= 20;\n\n-- 뷰 사용 (일반 테이블처럼)\nSELECT * FROM active_adult_users;`,
            language: 'sql'
          }
        ]
      },
      {
        id: 'sql-part3',
        title: 'Part 3. 고급: 프로그래밍 및 최적화',
        items: [
          {
            id: 'sql-procedure-func',
            title: '프로시저 / 함수 (Function & Procedure)',
            description: '반복되는 비즈니스 로직을 DB 내부에 저장해둡니다. 파라미터(인자)를 받고 제어문도 쓸 수 있습니다. (Postgres는 Function을 더 널리 씁니다)',
            code: `CREATE OR REPLACE FUNCTION get_discount(price NUMERIC)\nRETURNS NUMERIC AS $$\nBEGIN\n  IF price > 1000 THEN\n    RETURN price * 0.9; -- 10% 할인\n  ELSE\n    RETURN price;\n  END IF;\nEND;\n$$ LANGUAGE plpgsql;`,
            language: 'sql'
          },
          {
            id: 'sql-date-time',
            title: '날짜 및 시간 다루기',
            description: '날짜 데이터에 더하고 빼거나 특정 포맷으로 변환합니다.',
            code: `-- 현재 시간 기준 한달 후 계산하기\nSELECT CURRENT_TIMESTAMP + INTERVAL '1 month';\n\n-- 특정 단위만 추출 (ex: 연도)\nSELECT EXTRACT(YEAR FROM created_at) FROM users;`,
            language: 'sql'
          },
          {
            id: 'sql-index',
            title: '검색 속도 올리기 (INDEX)',
            description: '책의 목차처럼 인덱스를 만들어 WHERE 조건 등에 의한 색인 속도를 비약적으로 높입니다.',
            code: `-- 유저네임 컬럼에 B-Tree 인덱스 생성\nCREATE INDEX idx_users_username ON users(username);\n\n-- 쿼리가 인덱스를 타는지 실행계획 확인\nEXPLAIN ANALYZE SELECT * FROM users WHERE username = 'John';`,
            language: 'sql'
          },
          {
            id: 'sql-fts',
            title: '전문 검색 (Full Text Search)',
            description: 'LIKE %검색어% 로는 느린 긴 텍스트 검색을 더 빠르고 유연하게 구현합니다.',
            code: `-- 'apple' 이라는 단어가 포함된 텍스트 찾기\nSELECT * FROM articles \nWHERE to_tsvector('english', body) @@ to_tsquery('apple');`,
            language: 'sql'
          },
          {
            id: 'sql-transaction',
            title: '안전한 거래 (TRANSACTION)',
            description: '여러 쿼리 작업이 모두 성공해야만 반영(COMMIT)하고, 중간에 실패하면 기존으로 되돌립니다(ROLLBACK). 돈 다룰 때 필수입니다.',
            code: `BEGIN;\n\nUPDATE accounts SET balance = balance - 100 WHERE id = 1; -- 출금\nUPDATE accounts SET balance = balance + 100 WHERE id = 2; -- 입금\n\nCOMMIT; -- 모두 문제없으면 확정\n-- 문제가 생겼을경우 ROLLBACK;`,
            language: 'sql'
          },
          {
            id: 'sql-trigger',
            title: '자동화 (TRIGGER)',
            description: '특정 테이블에 데이터 변경(INSERT, UPDATE, DELETE)이 생길 때, 자동으로 미리 지정된 함수를 실행합니다.',
            code: `CREATE TRIGGER update_modified_time\nBEFORE UPDATE ON users\nFOR EACH ROW\nEXECUTE FUNCTION set_updated_at();`,
            language: 'sql'
          }
        ]
      }
    ]
  },
  {
    id: 'sqlalchemy',
    title: 'SQLAlchemy (Python)',
    categories: [
      {
        id: 'sa-part1',
        title: 'Part 1. 기초: 연결과 기본 쿼리',
        items: [
          {
            id: 'sa-intro',
            title: 'SQLAlchemy란?',
            description: 'SQLAlchemy는 파이썬에서 가장 안정적이고 널리 쓰이는 ORM(Object Relational Mapping) 도구입니다. 데이터베이스 테이블을 파이썬 클래스로 매핑하고, 파이썬 객체를 통해 데이터를 조작할 수 있게 해줍니다. 원시 SQL을 직접 작성할 때 발생하는 의존성, 재사용성 문제를 해결하며, 쿼리 결과를 편리한 객체 형태로 관리하기 때문에 강력한 데이터 접근 추상화를 제공합니다. 장기적인 유지보수가 중요한 상용 제품 서비스에 필수로 적용되는 기술입니다.'
          },
          {
            id: 'sa-engine-session',
            title: '엔진 및 세션 (Engine & Session)',
            description: '데이터베이스 통신을 담당하는 Engine과 쿼리를 실행하는 Session을 설정합니다.',
            code: `from sqlalchemy import create_engine\nfrom sqlalchemy.orm import Session\n\n# 데이터베이스 연결 주소 설정 (echo=True는 실행 SQL 출력)\nengine = create_engine('postgresql://user:password@localhost/mydb', echo=True)\n\n# 세션 컨텍스트 매니저를 통해 안전하게 연결\nwith Session(engine) as session:\n    # 데이터베이스 작업 수행\n    pass`,
            language: 'python'
          },
          {
            id: 'sa-models',
            title: '테이블 모델 선언 (Declarative Base)',
            description: '타입 힌트(Mapped)를 활용하여 파이썬 클래스를 데이터베이스 테이블에 매핑합니다.',
            code: `from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column\nfrom sqlalchemy import String\n\nclass Base(DeclarativeBase):\n    pass\n\nclass User(Base):\n    __tablename__ = 'users'\n    \n    id: Mapped[int] = mapped_column(primary_key=True)\n    name: Mapped[str] = mapped_column(String(30), nullable=False)\n    age: Mapped[int | None] # Optional field\n\n# DB에 테이블 생성 (개발 환경에서 주로 사용)\nBase.metadata.create_all(engine)`,
            language: 'python'
          },
          {
            id: 'sa-insert-bulk',
            title: '데이터 생성 (Insert & Bulk Insert)',
            description: '단일 객체를 추가하거나, add_all()을 사용하여 여러 개의 객체를 한 번에 삽입합니다.',
            code: `with Session(engine) as session:\n    # 단일 객체 추가\n    user1 = User(name="Alice", age=25)\n    session.add(user1)\n\n    # 여러 객체 일괄 추가\n    users = [\n        User(name="Bob", age=30),\n        User(name="Charlie", age=35)\n    ]\n    session.add_all(users)\n    \n    session.commit() # 트랜잭션 확정`,
            language: 'python'
          },
          {
            id: 'sa-select-basic',
            title: '기본 데이터 조회 (Select, Where, Order By)',
            description: 'select() 구문에 조건을 추가하고, 특정 기준에 따라 정렬된 결과를 가져옵니다.',
            code: `from sqlalchemy import select\n\nwith Session(engine) as session:\n    # 20살 이상인 유저를 나이 내림차순으로 정렬\n    stmt = select(User).where(User.age >= 20).order_by(User.age.desc())\n    \n    # scalars()를 통해 ORM 객체 스트림 획득 후 리스트 변환\n    users = session.scalars(stmt).all()\n    \n    for u in users:\n        print(u.name, u.age)`,
            language: 'python'
          }
        ]
      },
      {
        id: 'sa-part2',
        title: 'Part 2. 관계매핑: 데이터 엮기 및 수정/삭제',
        items: [
          {
            id: 'sa-relationship-1-n',
            title: '1:N 관계설정 (One to Many)',
            description: 'ForeignKey와 relationship()을 사용해 테이블 간의 참조 관계를 파이썬 속성인 것처럼 쉽게 탐색할 수 있습니다.',
            code: `from sqlalchemy import ForeignKey\nfrom sqlalchemy.orm import relationship\n\nclass Post(Base):\n    __tablename__ = 'posts'\n    \n    id: Mapped[int] = mapped_column(primary_key=True)\n    title: Mapped[str] = mapped_column(String(50))\n    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))\n    \n    # User 객체에서 user.posts 로 접근 가능하게 양방향 매핑\n    author: Mapped["User"] = relationship(back_populates="posts")\n\n# User 클래스에 추가할 속성:\n# posts: Mapped[list["Post"]] = relationship(back_populates="author")`,
            language: 'python'
          },
          {
            id: 'sa-update',
            title: '데이터 속성 수정 (Update)',
            description: '객체를 조회한 뒤, 속성 값을 변경하고 다시 세션에 커밋하여 반영합니다.',
            code: `with Session(engine) as session:\n    # 1. 수정할 객체 조회\n    stmt = select(User).where(User.name == 'Alice')\n    alice = session.scalars(stmt).first()\n    \n    if alice:\n        # 2. 파이썬 속성 변경\n        alice.age = 26\n        # 3. 변경사항 커밋\n        session.commit()`,
            language: 'python'
          },
          {
            id: 'sa-delete',
            title: '데이터베이스 레코드 삭제 (Delete)',
            description: '필요 없는 레코드를 세션의 delete() 메서드를 통해 삭제합니다.',
            code: `with Session(engine) as session:\n    stmt = select(User).where(User.name == 'Charlie')\n    charlie = session.scalars(stmt).first()\n    \n    if charlie:\n        session.delete(charlie)\n        session.commit()`,
            language: 'python'
          },
          {
            id: 'sa-bulk-update',
            title: '대량 수정 (Bulk Update)',
            description: '쿼리를 이용해 한 번의 명령으로 여러 레코드의 값을 동시에 갱신합니다. (성능 최적화)',
            code: `from sqlalchemy import update\n\nwith Session(engine) as session:\n    # 30살 이상인 유저들의 나이를 모두 1살씩 증가시킴\n    stmt = (\n        update(User)\n        .where(User.age >= 30)\n        .values(age=User.age + 1)\n    )\n    session.execute(stmt)\n    session.commit()`,
            language: 'python'
          }
        ]
      },
      {
        id: 'sa-part3',
        title: 'Part 3. 실무 쿼리 기법: 조인과 집계',
        items: [
          {
            id: 'sa-join',
            title: '데이터 결합 (Inner Join & Left Join)',
            description: 'join() 또는 isouter=True를 통해 필요한 여러 테이블을 한 번에 읽어옵니다.',
            code: `with Session(engine) as session:\n    # User와 Post를 조인하여 데이터를 튜플 형태로 가져오기\n    stmt = select(User.name, Post.title).join(Post, User.id == Post.user_id)\n    \n    # Left Outer Join (작성한 글이 없는 유저도 포함)\n    # stmt = select(User, Post).join(Post, isouter=True)\n    \n    for user_name, post_title in session.execute(stmt):\n        print(f"{user_name} wrote {post_title}")`,
            language: 'python'
          },
          {
            id: 'sa-aggregates',
            title: '집계 및 그룹핑 (Group By, Count, Sum)',
            description: 'sqlachemy.func 모듈을 이용해 그룹별 통계를 계산합니다.',
            code: `from sqlalchemy import func\n\nwith Session(engine) as session:\n    # 유저별 작성한 포스트 개수 구하기\n    stmt = (\n        select(User.name, func.count(Post.id))\n        .join(Post, User.id == Post.user_id, isouter=True)\n        .group_by(User.id, User.name)\n    )\n    \n    for author, post_count in session.execute(stmt):\n        print(f"{author} has {post_count} posts.")`,
            language: 'python'
          },
          {
            id: 'sa-pagination',
            title: '페이지네이션 (Limit & Offset)',
            description: '많은 양의 데이터를 가져올 때, 특정 페이지의 부분 데이터만 조회합니다.',
            code: `with Session(engine) as session:\n    page = 2\n    page_size = 10\n    \n    # 11번째 데이터부터 10개를 가져옴\n    stmt = select(User).order_by(User.id).offset((page - 1) * page_size).limit(page_size)\n    \n    paged_users = session.scalars(stmt).all()\n    print(f"Total entries in this page: {len(paged_users)}")`,
            language: 'python'
          },
          {
            id: 'sa-subquery',
            title: '서브쿼리 / CTE (Subquery / CTE)',
            description: '복잡한 중첩 쿼리나 공통 테이블 식을 객체지향 방식으로 구성합니다.',
            code: `with Session(engine) as session:\n    # 평균 나이를 계산하는 서브쿼리\n    avg_age_subq = select(func.avg(User.age)).scalar_subquery()\n    \n    # 평균 나이보다 나이가 많은 유저만 필터링\n    stmt = select(User).where(User.age > avg_age_subq)\n    \n    # 실행\n    for u in session.scalars(stmt):\n        print(u.name)`,
            language: 'python'
          }
        ]
      },
      {
        id: 'sa-part4',
        title: 'Part 4. 최적화: N+1 문제와 비동기',
        items: [
          {
            id: 'sa-eager-loading',
            title: '즉시 로딩으로 N+1 문제 해결 (Eager Loading)',
            description: '컬렉션을 접근할 때마다 쿼리가 발생하는 N+1 문제를 방지하기 위해 쿼리 단계에서 연관 데이터를 한 번에 가져옵니다.',
            code: `from sqlalchemy.orm import selectinload, joinedload\n\nwith Session(engine) as session:\n    # 주의: selectinload는 별도 쿼리로 in_ 연산자를 통해 1:N 관계를 로딩함 (리스트에 유리)\n    # joinedload는 JOIN을 통해 1:1 관계를 로딩함\n    stmt = select(User).options(selectinload(User.posts))\n    \n    users = session.scalars(stmt).all()\n    for u in users:\n        # DB에 추가 접근(쿼리) 없이 하위 데이터(posts) 사용 가능!\n        print(u.name, [p.title for p in u.posts])`,
            language: 'python'
          },
          {
            id: 'sa-raw-sql',
            title: 'SQL 주입 안전한 원시 쿼리 (Raw SQL)',
            description: 'ORM으로 표현하기 힘들거나 극한의 튜닝이 필요한 쿼리를 파라미터 바인딩과 함께 안전히 실행합니다.',
            code: `from sqlalchemy import text\n\nwith Session(engine) as session:\n    # 파라미터가 포함된 SQL\n    stmt = text("SELECT id, name FROM users WHERE age >= :min_age")\n    \n    # 실행하면서 파라미터 딕셔너리 제공\n    results = session.execute(stmt, {"min_age": 20})\n    \n    for row in results:\n        # row.id 처럼 키로 접근 가능\n        print(f"[{row.id}] {row.name}")`,
            language: 'python'
          },
          {
            id: 'sa-asyncio',
            title: 'FastAPI 환상의 짝꿍: 비동기 설정 (AsyncIO)',
            description: 'FastAPI의 속도를 극대화하기 위해 완전한 비동기(non-blocking) DB 엔진과 세션을 사용합니다.',
            code: `from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession\n\n# 드라이버를 asyncpg (Postgres) 등으로 교체해야 함\nasync_engine = create_async_engine('postgresql+asyncpg://user:pass@localhost/mydb')\n\nasync def get_users():\n    # 비동기 컨텍스트 매니저\n    async with AsyncSession(async_engine) as session:\n        stmt = select(User)\n        \n        # await를 이용해 결과를 비동기적으로 기다림\n        result = await session.execute(stmt)\n        return result.scalars().all()`,
            language: 'python'
          },
          {
            id: 'sa-transaction',
            title: '오류 방어: 트랜잭션 수동 제어',
            description: '비즈니스 로직 중 예외가 발생할 경우, rollback()을 호출해 데이터가 꼬이는 것을 방지합니다.',
            code: `with Session(engine) as session:\n    try:\n        session.add(User(name="Daniel", age=40))\n        \n        # 여기서 DB 제약조건 위반 또는 서버 에러가 발생했다면?\n        # raise Exception("Oops!")\n        \n        session.commit()\n    except Exception as e:\n        # 실패 시 전부 원상복구\n        session.rollback()\n        print(f"Transaction failed: {e}")`,
            language: 'python'
          }
        ]
      }
    ]
  },
  {
    id: 'sqlmodel',
    title: 'SQLModel (Python)',
    categories: [
      {
        id: 'sm-part1',
        title: 'Part 1. 기초: 스키마 정의 및 조작',
        items: [
          {
            id: 'sm-intro',
            title: 'SQLModel이란?',
            description: 'SQLModel은 SQLAlchemy(DB ORM)와 Pydantic(FastAPI의 데이터 검증 라이브러리)의 장점을 한데 묶은 최신 라이브러리입니다. FastAPI의 창시자가 직접 만들었기에, SQLAlchemy의 강력한 ORM 기능을 그대로 쓰면서도 별도의 중복(DB용 모델 클래스 정의, 검증용 DTO 정의) 없이 하나의 모델 코드로 유지보수할 수 있습니다. 학습 난이도와 보일러플레이트 코드를 줄여주며, 특히 FastAPI와의 결합도가 압도적으로 높아 모던 웹 파이썬 백엔드를 구성할 때 우선적으로 권장됩니다.'
          },
          {
            id: 'sm-models',
            title: '모델 정의 (SQLModel & Pydantic)',
            description: 'SQLModel 클래스를 상속받아 데이터베이스 테이블과 Pydantic(데이터 검증) 모델을 동시에 정의합니다.',
            code: `from sqlmodel import Field, SQLModel\nfrom typing import Optional\n\n# table=True면 테이블 생성 매핑, False면 단순 Pydantic 검증 모델(기본값)\nclass Hero(SQLModel, table=True):\n    # primary_key 지정\n    id: Optional[int] = Field(default=None, primary_key=True)\n    # 인덱스 생성\n    name: str = Field(index=True)\n    secret_name: str\n    # 옵셔널 (Nullable)\n    age: Optional[int] = None`,
            language: 'python'
          },
          {
            id: 'sm-engine-create',
            title: '엔진 연결 및 테이블 생성',
            description: 'create_engine을 이용해 DB에 연결하고, SQLModel.metadata.create_all을 통해 테이블을 실제로 만듭니다.',
            code: `from sqlmodel import create_engine, SQLModel\n\nsqlite_file_name = "database.db"\nsqlite_url = f"sqlite:///{sqlite_file_name}"\n\n# echo=True 설정을 통해 실제 렌더링 된 SQL들을 확인 가능합니다.\nengine = create_engine(sqlite_url, echo=True)\n\n# 정의된 모든 모델을 스캔하여 DB에 테이블로 생성합니다. (앱 시작 시 활용)\ndef create_db_and_tables():\n    SQLModel.metadata.create_all(engine)`,
            language: 'python'
          },
          {
            id: 'sm-insert-session',
            title: '데이터 생성 파이프라인 (Session.add)',
            description: 'Session을 활용해 파이썬 인스턴스로 정의된 데이터를 DB에 추가합니다.',
            code: `from sqlmodel import Session\n\ndef create_heroes():\n    hero_1 = Hero(name="Deadpond", secret_name="Dive Wilson")\n    hero_2 = Hero(name="Spider-Boy", secret_name="Pedro Parqueador")\n    \n    with Session(engine) as session:\n        session.add(hero_1)\n        session.add(hero_2)\n        \n        session.commit() # 실제 DB 저장\n        session.refresh(hero_1) # DB 저장 후 id 등 자동 생성 속성을 객체에 업데이트(반영) 시킴`,
            language: 'python'
          }
        ]
      },
      {
        id: 'sm-part2',
        title: 'Part 2. 활용: 데이터 조회/수정/삭제',
        items: [
          {
            id: 'sm-select',
            title: '단일 검색조건 (Select & Where)',
            description: 'select() 함수와 Session.exec()를 이용해 조건에 맞는 데이터를 하나 혹은 여러 개 가져옵니다.',
            code: `from sqlmodel import select, Session\n\nwith Session(engine) as session:\n    # WHERE 조건이 추가된 Select 객체\n    statement = select(Hero).where(Hero.name == "Deadpond")\n    \n    # exec를 이용해 실행 후 결과 스캔\n    # .first() : 첫 번째 값 (없으면 None)\n    # .one() : 정확히 1개 보장 (없거나 여러개면 Exception 발생)\n    hero = session.exec(statement).first()\n    print(hero)`,
            language: 'python'
          },
          {
            id: 'sm-pagination',
            title: '페이지네이션 (Offset & Limit)',
            description: '대량의 데이터를 조금씩 나누어 가져올 때 사용합니다. FastAPI 라우터와 궁합이 찰떡입니다.',
            code: `with Session(engine) as session:\n    offset = 0 # 스킵할 아이템 수\n    limit = 10 # 가져올 아이템 수\n    \n    # offset과 limit를 걸어 부분 결과만 가져옵니다\n    statement = select(Hero).offset(offset).limit(limit)\n    heroes = session.exec(statement).all()\n    \n    print(f"Loaded {len(heroes)} heroes")`,
            language: 'python'
          },
          {
            id: 'sm-update',
            title: '데이터 업데이트 (Update & Refresh)',
            description: '데이터를 데이터베이스에서 가져온 뒤, 객체 속성을 수정하고 커밋합니다.',
            code: `with Session(engine) as session:\n    statement = select(Hero).where(Hero.name == "Spider-Boy")\n    hero = session.exec(statement).one()\n    \n    # Pydantic을 쓰듯 간단히 객체 속성을 수정\n    hero.age = 16\n    hero.name = "Spider-Man"\n    \n    # 세션에 속성이 변경되었음을 알린 후 커밋\n    session.add(hero)\n    session.commit()\n    # 업데이트된 버전으로 동기화\n    session.refresh(hero)`,
            language: 'python'
          },
          {
            id: 'sm-delete',
            title: '객체 삭제 (Delete)',
            description: 'Session.delete() 함수를 사용해 데이터베이스에서 완전히 레코드를 지웁니다.',
            code: `with Session(engine) as session:\n    statement = select(Hero).where(Hero.name == "Spider-Man")\n    hero = session.exec(statement).one()\n    \n    # 객체를 삭제하고 확정\n    session.delete(hero)\n    session.commit()`,
            language: 'python'
          }
        ]
      },
      {
        id: 'sm-part3',
        title: 'Part 3. 고급: 테이블 간 관계 매핑',
        items: [
          {
            id: 'sm-foreign-key',
            title: '외래 키 추가 구조 (Foreign Keys)',
            description: 'Field(foreign_key=...) 를 사용하여 다른 테이블의 기본 키를 참조합니다.',
            code: `class Team(SQLModel, table=True):\n    id: Optional[int] = Field(default=None, primary_key=True)\n    name: str = Field(index=True)\n    headquarters: str\n\n# Hero에 Team의 ID를 외래키로 추가\nclass Hero(SQLModel, table=True):\n    id: Optional[int] = Field(default=None, primary_key=True)\n    name: str = Field(index=True)\n    \n    # ForeignKey 설정\n    team_id: Optional[int] = Field(default=None, foreign_key="team.id")`,
            language: 'python'
          },
          {
            id: 'sm-relationship',
            title: '양방향 속성 정의 (Relationship)',
            description: 'Relationship() 을 통해 DB 쿼리 없이도 객체 안에서 서로 양방향(1:N) 탐색을 할 수 있도록 만듭니다.',
            code: `from sqlmodel import Relationship\n\nclass Team(SQLModel, table=True):\n    # ... (생략)\n    # 하나의 팀이 다수의 영웅(Hero)을 가지게 됨 (List 타입 명시)\n    heroes: list["Hero"] = Relationship(back_populates="team")\n\nclass Hero(SQLModel, table=True):\n    # ... (생략)\n    team_id: Optional[int] = Field(default=None, foreign_key="team.id")\n    # Team 객체로 바로 접근 가능\n    team: Optional[Team] = Relationship(back_populates="heroes")`,
            language: 'python'
          },
          {
            id: 'sm-inner-join',
            title: '내부 조인 (Inner Join)',
            description: 'join()을 이용해 두 개 이상의 모델을 연결(교집합)합니다. 두 테이블 모두에 데이터가 있는 경우만 조회됩니다.',
            code: `with Session(engine) as session:\n    # Hero와 Team 데이터를 한 번에 가져오기 (Team에 소속되지 않은 Hero는 리스트에서 제외됨)\n    statement = select(Hero, Team).join(Team)\n    \n    # (Hero, Team) 튜플 형태로 결과가 반환됩니다.\n    results = session.exec(statement)\n    for hero, team in results:\n        print(f"Hero: {hero.name}, belongs to Team: {team.name}")`,
            language: 'python'
          },
          {
            id: 'sm-left-join',
            title: '외부 조인 (Left Outer Join)',
            description: 'isouter=True 속성을 추가하여, 매칭되는 대상이 없더라도 왼쪽 테이블의 데이터는 모두 가져옵니다.',
            code: `with Session(engine) as session:\n    # Team이 없는 Hero도 모두 조회하기 위함 (Left Join)\n    statement = select(Hero, Team).join(Team, isouter=True)\n    \n    results = session.exec(statement)\n    for hero, team in results:\n        # team은 None일 수 있습니다. (히어로가 팀에 속하지 않은 경우)\n        team_name = team.name if team else "No Team"\n        print(f"Hero: {hero.name}, Team: {team_name}")`,
            language: 'python'
          },
          {
            id: 'sm-eager-loading',
            title: 'Eager Loading (selectinload / joinedload)',
            description: 'N+1 쿼리 문제를 해결하기 위해, 연관된 데이터들을 사전에 쿼리하여 메모리에 함께 로딩해둡니다.',
            code: `from sqlalchemy.orm import selectinload, joinedload\n\nwith Session(engine) as session:\n    # selectinload: 1:N 관계에서 주로 사용 (별도의 SELECT 쿼리를 1번 더 실행하여 매핑함. 리스트에 적합)\n    # joinedload: 1:1 또는 N:1 관계에서 주로 사용 (JOIN을 통해 한 번의 쿼리로 다 가져옴)\n    statement = select(Team).options(selectinload(Team.heroes))\n    \n    teams = session.exec(statement).all()\n    for team in teams:\n        # 관계형 데이터(team.heroes)에 접근할 때 DB 조회가 또 발생하지 않습니다.\n        print(f"Team: {team.name}, Heroes Count: {len(team.heroes)}")`,
            language: 'python'
          }
        ]
      },
      {
        id: 'sm-part4',
        title: 'Part 4. 실전! FastAPI API 통합',
        items: [
          {
            id: 'sm-fastapi-depends',
            title: 'Session 의존성 주입 (Depends)',
            description: 'FastAPI의 라우터에서 안전한 트랜잭션 관리를 위해 Session을 Generator(yield)로 주입받습니다.',
            code: `from fastapi import FastAPI, Depends\n\napp = FastAPI()\n\ndef get_session():\n    with Session(engine) as session:\n        yield session\n\n# 엔드포인트에서 db: Session 파라미터로 쉽게 주입받음\n@app.get("/heroes/")\ndef read_heroes(session: Session = Depends(get_session)):\n    heroes = session.exec(select(Hero)).all()\n    return heroes`,
            language: 'python'
          },
          {
            id: 'sm-create-api',
            title: 'POST 리소스 생성 엔드포인트 구현',
            description: '검증된 데이터를 받아 DB에 저장하고, 새로 생성된 자원을 그대로 반환합니다.',
            code: `from fastapi import HTTPException\n\n@app.post("/heroes/", response_model=Hero)\ndef create_hero(hero: Hero, session: Session = Depends(get_session)):\n    # request body에서 파싱된 hero 객체를 그대로 Session에 추가\n    session.add(hero)\n    session.commit()\n    # DB에 삽입되어 자동 생성된 ID값을 동기화\n    session.refresh(hero)\n    \n    # JSON 응답으로 생성된 데이터를 반환\n    return hero`,
            language: 'python'
          },
          {
            id: 'sm-crud-404',
            title: 'PATCH / DELETE 에러(404) 처리 핸들링',
            description: '수정이나 삭제 요청이 들어왔을 때, 데이터베이스에 없으면 안전하게 404를 내려줍니다.',
            code: `@app.get("/heroes/{hero_id}", response_model=Hero)\ndef read_hero(hero_id: int, session: Session = Depends(get_session)):\n    hero = session.get(Hero, hero_id)\n    if not hero:\n        # 객체를 못찾을 경우 FastAPI의 핵심 Error Raising 적용\n        raise HTTPException(status_code=404, detail="Hero not found")\n    \n    return hero`,
            language: 'python'
          }
        ]
      }
    ]
  },
  {
    id: 'fastapi',
    title: 'FastAPI (Python)',
    categories: [
      {
        id: 'fastapi-part1',
        title: 'Part 1. 아키텍처 및 기초: 블로그 사이트 구조와 모델',
        items: [
          {
            id: 'fastapi-intro',
            title: 'FastAPI란?',
            description: 'FastAPI는 파이썬 3.6+의 타입 힌트를 기반으로 하는 빠르고(Fast) 현대적인 웹 프레임워크입니다. 높은 성능을 자랑하며 자동으로 API 문서(Swagger UI)를 생성해 줍니다. Pydantic을 이용한 강력한 데이터 검증 기능을 내장하고 있어, 블로그 사이트와 같은 RESTful API 서버를 개발할 때 생산성과 안정성이 크게 향상됩니다.'
          },
          {
            id: 'fastapi-run-swagger',
            title: '서버 실행 및 대화형 API 문서 (Swagger UI)',
            description: '코드를 작성한 뒤에는 uvicorn을 이용해 서버를 구동합니다. FastAPI의 가장 강력한 장점 중 하나는 코드를 바탕으로 자동으로 대화형 API 문서가 생성된다는 점입니다. 개발 중 포스트맨(Postman) 없이도 브라우저에서 직접 API를 테스트할 수 있습니다.',
            code: '# 터미널에서 아래 명령어로 서버를 실행합니다. (main.py 내에 app 객체가 있는 경우)\n# --reload 옵션을 주면 코드를 수정할 때마다 서버가 자동으로 재시작됩니다.\nuvicorn app.main:app --reload\n\n# 서버 실행 후 브라우저 접속 주소:\n# 1. API 기본 주소: http://127.0.0.1:8000\n# 2. 대화형 API 문서 (Swagger UI): http://127.0.0.1:8000/docs\n# 3. 대체 API 문서 (ReDoc): http://127.0.0.1:8000/redoc',
            language: 'python'
          },
          {
            id: 'fastapi-arch',
            title: '블로그 사이트 개발용 코드 아키텍처',
            description: '확장성을 고려한 FastAPI 블로그 백엔드의 표준적인 디렉터리 구조입니다. 역할에 따라 폴더를 분리하여 유지보수를 용이하게 합니다.',
            code: `my_blog_project/
├── app/
│   ├── main.py           # FastAPI 애플리케이션 진입점 및 전역 설정
│   ├── api/              # API 라우터 (APIRouter) 모음
│   │   ├── endpoints/    # users.py, posts.py 등 리소스별 엔드포인트
│   │   └── deps.py       # 의존성 (Depends) 관련 함수 (DB 세션, 현재 유저 등)
│   ├── core/             # 핵심 설정 (config.py, security.py 등)
│   ├── crud/             # 데이터베이스 조작 로직 분리 (CRUD 함수들)
│   ├── models/           # SQLModel DB 테이블 및 데이터 검증 스키마
│   ├── db/               # 데이터베이스 세션 생성 및 초기화 로직
│   ├── templates/        # Jinja2 HTML 템플릿 파일 폴더 (프론트엔드)
│   └── static/           # CSS, JS, 이미지 등 정적 파일 폴더
├── alembic/              # 마이그레이션 환경 폴더
├── alembic.ini           # Alembic 설정 파일
└── requirements.txt      # 패키지 의존성 목록`,
            language: 'python'
          },
          {
            id: 'fastapi-models',
            title: '블로그 포스트 모델 정의 (SQLModel)',
            description: 'SQLModel을 활용하여 데이터베이스 테이블 구조와 데이터 검증을 동시에 처리하는 모델을 작성합니다. id(Primary Key), title, content, thumbnail, created_at, author_id 속성을 정의합니다.',
            code: 'from datetime import datetime\nfrom typing import Optional\nfrom sqlmodel import SQLModel, Field\n\nclass PostBase(SQLModel):\n    title: str = Field(index=True)\n    content: str\n    thumbnail: Optional[str] = None\n    author_id: int = Field(foreign_key="user.id")\n\nclass Post(PostBase, table=True):\n    id: Optional[int] = Field(default=None, primary_key=True)\n    created_at: datetime = Field(default_factory=datetime.utcnow)\n\nclass PostCreate(PostBase):\n    pass\n\nclass PostUpdate(SQLModel):\n    title: Optional[str] = None\n    content: Optional[str] = None\n    thumbnail: Optional[str] = None\n\nclass User(SQLModel, table=True):\n    id: Optional[int] = Field(default=None, primary_key=True)\n    username: str = Field(unique=True, index=True)\n    hashed_password: str',
            language: 'python'
          },
          {
            id: 'fastapi-sqlmodel-relationships',
            title: '모델 관계 설정 (1:N, User와 Post)',
            description: '블로그 환경에서는 한 명의 사용자(User)가 여러 개의 글(Post)을 작성할 수 있습니다. 외래키(foreign_key) 외에도 SQLModel의 Relationship 속성을 선언해두면, 코드를 작성할 때 파이썬 객체 안에서 post.author 혹은 user.posts 형태로 연결된 데이터에 손쉽게 접근할 수 있습니다.',
            code: 'from typing import List, Optional\nfrom sqlmodel import SQLModel, Field, Relationship\n\n# User 클래스에 posts 관계 추가\nclass User(SQLModel, table=True):\n    # ... (기존 속성들 생략)\n    id: Optional[int] = Field(default=None, primary_key=True)\n    username: str = Field(unique=True, index=True)\n    hashed_password: str\n    \n    # User는 여러 개의 Post를 가질 수 있습니다 (1:N)\n    posts: List["Post"] = Relationship(back_populates="author")\n\n# Post 클래스에 author 관계 추가\nclass Post(SQLModel, table=True):\n    # ... (기존 속성들 생략)\n    id: Optional[int] = Field(default=None, primary_key=True)\n    title: str\n    author_id: int = Field(foreign_key="user.id")\n    \n    # 하나의 Post는 단일 User(작성자)에 속합니다\n    author: Optional[User] = Relationship(back_populates="posts")',
            language: 'python'
          },
          {
            id: 'fastapi-lifespan',
            title: '애플리케이션 생명주기 (Lifespan)',
            description: 'lifespan(생명주기) 제너레이터를 사용하여 애플리케이션이 시작될 때 초기화 작업(예: DB 테이블 생성)을 수행하고, 종료될 때 정리 작업을 수행하는 현대적인 방식을 활용합니다.',
            code: 'from fastapi import FastAPI\nfrom sqlmodel import SQLModel\nfrom contextlib import asynccontextmanager\nfrom app.db import engine # 생성해둔 engine 임포트\n\n# 앱 시작/종료 시 실행될 로직을 lifespan 제너레이터로 묶어줍니다.\n@asynccontextmanager\nasync def lifespan(app: FastAPI):\n    # 앱 시작 시 실행: DB 테이블 생성\n    SQLModel.metadata.create_all(engine)\n    print("데이터베이스 테이블 생성 완료")\n    yield\n    # yield 이후는 앱이 종료될 때 실행됩니다.\n    print("애플리케이션 종료")\n\n# lifespan을 FastAPI 앱에 등록\napp = FastAPI(lifespan=lifespan)',
            language: 'python'
          },
          {
            id: 'fastapi-db-session',
            title: '의존성 주입(Depends)으로 Session 관리하기',
            description: 'FastAPI의 강력한 기능인 의존성 주입(Dependency Injection)을 사용하여 요청마다 데이터베이스 세션을 생성하고 종료하는 함수를 만듭니다.',
            code: 'from fastapi import FastAPI, Depends\nfrom sqlmodel import create_engine, Session\n\nsqlite_file_name = "blog.db"\nsqlite_url = f"sqlite:///{sqlite_file_name}"\nengine = create_engine(sqlite_url, echo=True)\n\n# 의존성으로 사용할 제너레이터 함수\ndef get_session():\n    with Session(engine) as session:\n        yield session\n\napp = FastAPI()\n\n# 라우터에서 사용 예시\n@app.get("/posts/")\ndef read_posts(session: Session = Depends(get_session)):\n    pass',
            language: 'python'
          }
        ]
      },
      {
        id: 'fastapi-part2',
        title: 'Part 2. 라우팅, 예외 처리 및 공통 의존성',
        items: [
          {
            id: 'fastapi-router',
            title: 'APIRouter를 활용한 라우팅 분리',
            description: '앱의 규모가 커지면 단일 파일(main.py) 대신 APIRouter를 사용해 리소스(예: users, posts)별로 API 엔드포인트를 나누어 관리합니다.',
            code: '# app/api/endpoints/posts.py\nfrom fastapi import APIRouter, Depends\n\nrouter = APIRouter()\n\n@router.get("/")\ndef read_posts_route():\n    return [{"title": "Hello Router"}]\n\n# app/main.py\nfrom fastapi import FastAPI\nfrom app.api.endpoints import posts\n\napp = FastAPI()\n\n# 하위 라우터를 메인 앱에 포함시키며 공통 prefix 및 태그를 부여합니다.\napp.include_router(posts.router, prefix="/posts", tags=["posts"])',
            language: 'python'
          },
          {
            id: 'fastapi-exception-handlers',
            title: '전역 예외 처리기 (Exception Handlers)',
            description: 'HTTPException 외에도 커스텀 예외를 발생시키거나 시스템 오류를 가로채어 클라이언트에게 일관된 에러 응답 포맷을 반환할 수 있도록 예외 처리기를 등록합니다.',
            code: 'from fastapi import FastAPI, Request\nfrom fastapi.responses import JSONResponse\n\nclass PostNotFoundException(Exception):\n    def __init__(self, post_id: int):\n        self.post_id = post_id\n\napp = FastAPI()\n\n@app.exception_handler(PostNotFoundException)\nasync def post_not_found_exception_handler(request: Request, exc: PostNotFoundException):\n    # 커스텀 예외가 발생하면 특정 JSON 구조로 응답합니다.\n    return JSONResponse(\n        status_code=404,\n        content={"message": f"Oops! The post {exc.post_id} could not be found."},\n    )\n\n@app.get("/posts/{post_id}")\nasync def read_post_custom_exc(post_id: int):\n    if post_id == 3:\n        raise PostNotFoundException(post_id=post_id)\n    return {"post_id": post_id}',
            language: 'python'
          },
          {
            id: 'fastapi-depends-pagination',
            title: 'Depends를 이용한 페이징 의존성 분리',
            description: '블로그 글 목록, 댓글 목록 등을 조회할 때 페이지네이션(offset, limit) 파라미터가 반복해서 사용됩니다. 이 공통 로직을 별도의 의존성(Depends)으로 분리하면 코드의 중복을 줄일 수 있습니다.',
            code: 'from fastapi import Depends, APIRouter\nfrom typing import Tuple\n\nrouter = APIRouter()\n\n# 공통으로 사용할 페이징 파라미터 의존성 함수\ndef get_pagination(offset: int = 0, limit: int = 10) -> Tuple[int, int]:\n    # 클라이언트가 너무 많은 데이터를 요청하지 못하도록 제한할 수 있습니다.\n    if limit > 100:\n        limit = 100\n    return offset, limit\n\n@router.get("/posts/")\ndef read_posts(pagination: Tuple[int, int] = Depends(get_pagination)):\n    offset, limit = pagination\n    # 실제 사용 예시: session.exec(select(Post).offset(offset).limit(limit)).all()\n    return {"offset": offset, "limit": limit}',
            language: 'python'
          },
          {
            id: 'fastapi-middleware-logging',
            title: '미들웨어를 활용한 로깅 및 시간 측정',
            description: '미들웨어(Middleware)는 요청이 엔드포인트에 도달하기 전, 그리고 응답이 클라이언트에게 전달되기 전에 공통적으로 실행되는 코드입니다. API 요청의 처리 시간을 측정하거나 접근 로그를 남길 때 매우 유용합니다.',
            code: 'from fastapi import FastAPI, Request\nimport time\n\napp = FastAPI()\n\n@app.middleware("http")\nasync def add_process_time_header(request: Request, call_next):\n    start_time = time.time()\n    \n    # 다음 미들웨어나 라우터로 요청을 넘기고 응답을 받아옵니다.\n    response = await call_next(request)\n    \n    process_time = time.time() - start_time\n    # 처리 시간을 커스텀 HTTP 헤더에 추가합니다.\n    response.headers["X-Process-Time"] = str(process_time)\n    \n    print(f"[{request.method}] {request.url.path} - {process_time:.4f}초")\n    return response',
            language: 'python'
          }
        ]
      },
      {
        id: 'fastapi-part3',
        title: 'Part 3. 핵심: 블로그 포스트 CRUD API',
        items: [
          {
            id: 'fastapi-crud-create',
            title: 'C: 포스트 생성 (POST)',
            description: '새로운 블로그 글을 작성하는 엔드포인트입니다. 클라이언트가 넘긴 데이터를 받아 데이터베이스에 저장합니다.',
            code: '@app.post("/posts/", response_model=Post)\ndef create_post(*, session: Session = Depends(get_session), post: PostCreate):\n    # Pydantic v2 방식 (SQLModel 0.0.14+ 권장)\n    db_post = Post.model_validate(post)\n    session.add(db_post)\n    session.commit()\n    session.refresh(db_post)\n    return db_post',
            language: 'python'
          },
          {
            id: 'fastapi-response-model',
            title: '응답 모델(Response Model)과 데이터 은닉',
            description: '데이터베이스 모델(Post, User 등)을 그대로 반환하면 비밀번호와 같은 민감한 정보가 클라이언트에 노출될 수 있습니다. 응답 전용 모델(예: PostPublic, UserPublic)을 만들어 response_model 속성에 지정하면, FastAPI가 반환 데이터에서 자동으로 민감한 정보를 필터링해 줍니다.',
            code: 'from sqlmodel import SQLModel\nfrom datetime import datetime\n\n# 외부에 노출할 공개용 응답 모델 (비밀번호나 내부 ID 제외)\nclass UserPublic(SQLModel):\n    username: str\n\nclass PostPublic(SQLModel):\n    id: int\n    title: str\n    content: str\n    created_at: datetime\n    # 작성자 정보도 공개용 모델로 포맷팅\n    author: UserPublic\n\n# 라우터 반환 시 자동으로 필터링 및 데이터 변환이 적용됨\n@app.get("/posts/{post_id}", response_model=PostPublic)\ndef read_post_public(post_id: int, session: Session = Depends(get_session)):\n    post = session.get(Post, post_id)\n    return post',
            language: 'python'
          },
          {
            id: 'fastapi-crud-read-all',
            title: 'R: 포스트 목록 조회 (GET)',
            description: '오프셋(offset)과 리밋(limit)을 활용하여 페이지네이션 처리가 된 게시글 목록을 불러옵니다.',
            code: 'from typing import List\nfrom sqlmodel import select\n\n@app.get("/posts/", response_model=List[Post])\ndef read_posts(offset: int = 0, limit: int = 20, session: Session = Depends(get_session)):\n    posts = session.exec(select(Post).offset(offset).limit(limit)).all()\n    return posts',
            language: 'python'
          },
          {
            id: 'fastapi-search-query',
            title: '블로그 포스트 검색 (Query Parameters)',
            description: '사용자가 입력한 키워드를 기반으로 포스트 제목이나 내용에서 검색을 수행하는 방법입니다. FastAPI에서는 경로 매개변수 외의 함수 인자가 자동으로 쿼리 매개변수(Query Params)가 됩니다.',
            code: 'from typing import List, Optional\nfrom sqlmodel import select, or_\n\n@app.get("/posts/search/", response_model=List[Post])\ndef search_posts(q: Optional[str] = None, session: Session = Depends(get_session)):\n    query = select(Post)\n    if q:\n        # 검색어(q)가 포함된 제목 또는 내용을 필터링합니다.\n        query = query.where(or_(Post.title.contains(q), Post.content.contains(q)))\n        \n    # 최신순 정렬 후 반환합니다.\n    posts = session.exec(query.order_by(Post.created_at.desc())).all()\n    return posts',
            language: 'python'
          },
          {
            id: 'fastapi-crud-read-one',
            title: 'R: 특정 포스트 상세 조회 (GET)',
            description: '포스트 ID를 경로 매개변수(Path parameter)로 받아 특정 글의 상세 내용을 조회합니다. 없을 경우 404 예외를 발생시킵니다.',
            code: 'from fastapi import HTTPException\n\n@app.get("/posts/{post_id}", response_model=Post)\ndef read_post(post_id: int, session: Session = Depends(get_session)):\n    post = session.get(Post, post_id)\n    if not post:\n        raise HTTPException(status_code=404, detail="Post not found")\n    return post',
            language: 'python'
          },
          {
            id: 'fastapi-crud-update',
            title: 'U: 포스트 수정 (PATCH)',
            description: '일부 내용만 수정하는 PATCH 라우트입니다. 클라이언트가 보낸 데이터 중 None이 아닌 값만 업데이트합니다.',
            code: '@app.patch("/posts/{post_id}", response_model=Post)\ndef update_post(*, session: Session = Depends(get_session), post_id: int, post_update: PostUpdate):\n    db_post = session.get(Post, post_id)\n    if not db_post:\n        raise HTTPException(status_code=404, detail="Post not found")\n    \n    # Pydantic v2 방식\n    update_data = post_update.model_dump(exclude_unset=True)\n    for key, value in update_data.items():\n        setattr(db_post, key, value)\n        \n    session.add(db_post)\n    session.commit()\n    session.refresh(db_post)\n    return db_post',
            language: 'python'
          },
          {
            id: 'fastapi-crud-delete',
            title: 'D: 포스트 삭제 (DELETE)',
            description: '특정 포스트를 삭제합니다.',
            code: '@app.delete("/posts/{post_id}")\ndef delete_post(*, session: Session = Depends(get_session), post_id: int):\n    post = session.get(Post, post_id)\n    if not post:\n        raise HTTPException(status_code=404, detail="Post not found")\n    \n    session.delete(post)\n    session.commit()\n    return {"ok": True}',
            language: 'python'
          }
        ]
      },
      {
        id: 'fastapi-part4',
        title: 'Part 4. 고급: 보안 및 JWT 인증 (Authentication)',
        items: [
          {
            id: 'fastapi-auth-intro',
            title: 'JWT 기반 인증의 이해',
            description: 'REST API에서는 상태를 저장하지 않으므로(stateless), 로그인 성공 시 클라이언트에게 서명된 토큰(JWT)을 발급하고 이후 요청 시 헤더를 통해 인증을 수행합니다. FastAPI에서는 OAuth2PasswordBearer를 통해 이를 쉽게 구현할 수 있습니다.'
          },
          {
            id: 'fastapi-password-hashing',
            title: '비밀번호 해싱 (Passlib & bcrypt)',
            description: '데이터베이스에 사용자 비밀번호를 평문으로 저장하는 것은 매우 위험합니다. passlib 라이브러리와 bcrypt 알고리즘을 사용하여 비밀번호를 단방향 암호화(해싱)하고 검증하는 유틸리티 함수를 만듭니다.',
            code: '# pip install "passlib[bcrypt]"\nfrom passlib.context import CryptContext\n\n# bcrypt를 기본 해싱 알고리즘으로 사용하는 컨텍스트 생성\npwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")\n\ndef verify_password(plain_password: str, hashed_password: str) -> bool:\n    # 평문 비밀번호와 해시된 비밀번호가 일치하는지 확인\n    return pwd_context.verify(plain_password, hashed_password)\n\ndef get_password_hash(password: str) -> str:\n    # 평문 비밀번호를 해싱하여 반환\n    return pwd_context.hash(password)',
            language: 'python'
          },
          {
            id: 'fastapi-auth-signup',
            title: '사용자 회원가입 (Sign Up)',
            description: '새로운 사용자를 등록할 때 비밀번호를 해싱하여 저장합니다. User 모델을 활용하며, 이미 존재하는 사용자명(username)일 경우 예외를 발생시킵니다.',
            code: 'from sqlmodel import select\nfrom fastapi import HTTPException\nfrom pydantic import BaseModel\n\nclass UserCreate(BaseModel):\n    username: str\n    password: str\n\n@app.post("/signup", response_model=UserPublic)\ndef create_user(user_in: UserCreate, session: Session = Depends(get_session)):\n    # 유저 중복 검사\n    existing_user = session.exec(select(User).where(User.username == user_in.username)).first()\n    if existing_user:\n        raise HTTPException(status_code=400, detail="Username already registered")\n    \n    # 비밀번호 해싱 및 저장\n    hashed_password = get_password_hash(user_in.password)\n    db_user = User(username=user_in.username, hashed_password=hashed_password)\n    session.add(db_user)\n    session.commit()\n    session.refresh(db_user)\n    return db_user',
            language: 'python'
          },
          {
            id: 'fastapi-auth-login',
            title: '로컬 로그인 및 토큰 발급 (Token Endpoint)',
            description: '사용자가 아이디/비밀번호를 보내면 이를 검증한 뒤 JWT를 생성하여 반환합니다.',
            code: 'from fastapi.security import OAuth2PasswordRequestForm\nfrom datetime import timedelta\n\n# 임의의 JWT 생성 함수 및 검증 로직 가정\nfrom app.security import verify_password, create_access_token\n\n@app.post("/token")\ndef login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):\n    # 1. 유저 조회\n    user = session.exec(select(User).where(User.username == form_data.username)).first()\n    \n    # 2. 패스워드 검증\n    if not user or not verify_password(form_data.password, user.hashed_password):\n        raise HTTPException(status_code=400, detail="Incorrect username or password")\n        \n    # 3. 액세스 토큰 생성\n    access_token_expires = timedelta(minutes=30)\n    access_token = create_access_token(\n        data={"sub": user.username}, expires_delta=access_token_expires\n    )\n    return {"access_token": access_token, "token_type": "bearer"}',
            language: 'python'
          },
          {
            id: 'fastapi-auth-dependency',
            title: 'Depends를 활용한 인증 보안 적용',
            description: '발급받은 JWT를 검증하여 로그인된 사용자 정보를 가져오는 의존성을 만듭니다. 이를 통해 안전한 블로그 글 작성 기능을 보호할 수 있습니다.',
            code: 'from fastapi.security import OAuth2PasswordBearer\nfrom jose import JWTError, jwt\n\noauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")\nSECRET_KEY = "my_secret_key"\nALGORITHM = "HS256"\n\ndef get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):\n    credentials_exception = HTTPException(status_code=401, detail="Could not validate credentials")\n    try:\n        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])\n        username: str = payload.get("sub")\n        if username is None:\n            raise credentials_exception\n    except JWTError:\n        raise credentials_exception\n        \n    user = session.exec(select(User).where(User.username == username)).first()\n    if user is None:\n        raise credentials_exception\n    return user\n\n# 보호된 API: 현재 인증된 유저(author) 정보를 글 작성에 활용\n@app.post("/posts/secure", response_model=Post)\ndef create_secure_post(*, session: Session = Depends(get_session), post: PostCreate, current_user: User = Depends(get_current_user)):\n    # Pydantic v2 방식 적용\n    db_post = Post.model_validate(post)\n    db_post.author_id = current_user.id  # 로그인한 유저의 ID를 작성자로 연결\n    session.add(db_post)\n    session.commit()\n    session.refresh(db_post)\n    return db_post',
            language: 'python'
          }
        ]
      },
      {
        id: 'fastapi-part5',
        title: 'Part 5. 정적 파일 제공 및 SSR (Static Files & Jinja2)',
        items: [
          {
            id: 'fastapi-static-files',
            title: '정적 파일 제공 (이미지 서버)',
            description: '업로드된 이미지(썸네일, 본문 이미지 등)를 클라이언트(브라우저)에서 접근할 수 있도록 URL을 통해 제공하려면 StaticFiles를 사용해 특정 디렉터리를 라우팅 경로에 마운트해야 합니다.',
            code: 'from fastapi import FastAPI\nfrom fastapi.staticfiles import StaticFiles\nimport os\n\napp = FastAPI()\n\nUPLOAD_DIR = "app/static/uploads"\nos.makedirs(UPLOAD_DIR, exist_ok=True)\n\n# /static 경로로 들어오는 요청을 app/static 디렉터리와 연결합니다.\n# 예: http://localhost:8000/static/uploads/thumb_1_img.png\napp.mount("/static", StaticFiles(directory="app/static"), name="static")',
            language: 'python'
          },
          {
            id: 'fastapi-jinja2-intro',
            title: 'Jinja2 설정 및 템플릿 렌더링 준비',
            description: 'FastAPI는 웹 애플리케이션 프레임워크인 Starlette를 기반으로 하므로, Jinja2Templates를 이용해 서버사이드 렌더링(SSR)을 쉽고 간편하게 구현할 수 있습니다. HTML을 동적으로 생성하여 풀스택 블로그 서비스로 거듭날 수 있습니다.',
            code: 'from fastapi import FastAPI, Request\nfrom fastapi.templating import Jinja2Templates\n\napp = FastAPI()\n\n# 템플릿 파일이 위치할 디렉터리 지정\ntemplates = Jinja2Templates(directory="app/templates")',
            language: 'python'
          },
          {
            id: 'fastapi-jinja2-render',
            title: 'Jinja2 템플릿에 데이터 렌더링하기',
            description: '템플릿 엔진을 사용하여 DB에 저장된 블로그 포스트 데이터를 화면에 출력해 봅니다. TemplateResponse를 반환하며 request 객체를 반드시 콘텍스트(context) 딕셔너리에 포함해야 합니다.',
            code: 'from fastapi import APIRouter, Request, Depends\nfrom sqlmodel import select, Session\nfrom typing import List\n# 위에서 정의한 get_session, Post 모델 등 임포트\n\nrouter = APIRouter()\n\n# 블로그 메인 페이지 (목록 화면)\n@router.get("/", response_class=HTMLResponse)\nasync def render_home(request: Request, session: Session = Depends(get_session)):\n    # DB에서 최신 포스트 10개를 조회합니다\n    posts = session.exec(select(Post).order_by(Post.created_at.desc()).limit(10)).all()\n    \n    # index.html 템플릿을 호출하며 포스트 데이터를 넘겨줍니다\n    return templates.TemplateResponse(\n        "index.html",\n        {\n            "request": request,     # 필수값\n            "blog_title": "My Awesome Blog",\n            "posts": posts\n        }\n    )',
            language: 'python'
          },
          {
            id: 'fastapi-jinja2-html',
            title: 'index.html 템플릿 파일 예시',
            description: 'Jinja2 문법({{ 변수명 }}, {% 제어문 %})을 사용해 서버에서 넘겨받은 컨텍스트 데이터를 HTML 상에 출력하는 템플릿 코드의 예시입니다.',
            code: '<!DOCTYPE html>\n<html>\n<head>\n    <title>{{ blog_title }}</title>\n    <!-- 정적 파일 링크 (url_for 사용 권장) -->\n    <link rel="stylesheet" href="{{ url_for(\'static\', path=\'style.css\') }}">\n</head>\n<body>\n    <h1>Welcome to {{ blog_title }}</h1>\n    \n    <ul class="post-list">\n        <!-- 넘겨받은 posts 리스트를 순회하며 렌더링 -->\n        {% for post in posts %}\n            <li>\n                <h2><a href="/posts/{{ post.id }}">{{ post.title }}</a></h2>\n                <!-- 썸네일 이미지가 있으면 표시 -->\n                {% if post.thumbnail %}\n                    <img src="{{ post.thumbnail }}" alt="Thumbnail">\n                {% endif %}\n                <p>{{ post.content[:100] }}...</p>\n                <small>Created at: {{ post.created_at.strftime("%Y-%m-%d") }}</small>\n            </li>\n        {% else %}\n            <li>현재 등록된 글이 없습니다.</li>\n        {% endfor %}\n    </ul>\n</body>\n</html>',
            language: 'html'
          }
        ]
      },
      {
        id: 'fastapi-part6',
        title: 'Part 6. 심화: 파일 업로드 (File Uploads)',
        items: [
          {
            id: 'fastapi-form-data',
            title: 'Form Data 처리하기 (Form)',
            description: 'Jinja2 기반의 HTML 폼이나 일반적인 application/x-www-form-urlencoded 데이터를 서버에서 받을 때는 Form 의존성을 사용합니다. JSON 바디를 받을 때와 달리 파라미터에 Form(...)을 명시해야 합니다.',
            code: 'from fastapi import APIRouter, Form\n\nrouter = APIRouter()\n\n@router.post("/login-form/")\ndef login_via_form(username: str = Form(...), password: str = Form(...)):\n    # HTML의 <form> 태그에서 전송된 데이터를 처리합니다.\n    return {"username": username, "message": "로그인 폼 제출 성공!"}',
            language: 'python'
          },
          {
            id: 'fastapi-file-upload-single',
            title: '단일 이미지 업로드 (썸네일)',
            description: '블로그 포스트의 썸네일과 같은 단일 파일을 업로드하는 방법입니다. FastAPI의 UploadFile 객체를 사용하면 비동기 환경에서도 파일을 안전하고 효율적으로 다룰 수 있습니다.',
            code: 'from fastapi import APIRouter, File, UploadFile\nimport shutil\nimport os\nimport uuid\n\nrouter = APIRouter()\nUPLOAD_DIR = "app/static/uploads"\nos.makedirs(UPLOAD_DIR, exist_ok=True)\n\n@router.post("/posts/{post_id}/thumbnail")\nasync def upload_thumbnail(post_id: int, file: UploadFile = File(...)):\n    # 파일명 중복을 피하기 위해 UUID 사용\n    file_extension = file.filename.split(".")[-1]\n    unique_filename = f"thumb_{post_id}_{uuid.uuid4().hex}.{file_extension}"\n    file_location = os.path.join(UPLOAD_DIR, unique_filename)\n    \n    # 파일을 청크 단위로 읽어 디스크에 저장합니다.\n    with open(file_location, "wb") as buffer:\n        shutil.copyfileobj(file.file, buffer)\n        \n    # 클라이언트가 접근할 수 있는 URL 경로 반환\n    return {"thumbnail_url": f"/static/uploads/{unique_filename}"}',
            language: 'python'
          },
          {
            id: 'fastapi-file-upload-multiple',
            title: '다중 이미지 업로드 (포스트 본문)',
            description: '블로그 포스트 본문에 들어갈 여러 개의 이미지를 동시에 업로드하는 방법입니다. List[UploadFile] 타입을 파라미터로 받아 순회하며 저장합니다.',
            code: 'from fastapi import APIRouter, File, UploadFile\nfrom typing import List\nimport shutil\nimport os\nimport uuid\n\n@router.post("/posts/{post_id}/images")\nasync def upload_multiple_images(post_id: int, files: List[UploadFile] = File(...)):\n    saved_urls = []\n    \n    for file in files:\n        file_extension = file.filename.split(".")[-1]\n        unique_filename = f"post_{post_id}_{uuid.uuid4().hex}.{file_extension}"\n        file_location = os.path.join(UPLOAD_DIR, unique_filename)\n        \n        with open(file_location, "wb") as buffer:\n            shutil.copyfileobj(file.file, buffer)\n            \n        saved_urls.append(f"/static/uploads/{unique_filename}")\n        \n    return {"image_urls": saved_urls}',
            language: 'python'
          },
          {
            id: 'fastapi-file-upload-html',
            title: 'HTML Form 파일 업로드 요소 구성',
            description: '파일 업로드를 지원하는 HTML 폼 양식 예시입니다. 단일 파일과 다중 파일(multiple) 속성을 폼 인풋(input)으로 구성할 수 있습니다. 폼 전송 시에는 반드시 enctype="multipart/form-data" 속성이 있어야 합니다.',
            code: '<!-- 파일 업로드용 폼. enctype은 필수입니다. -->\n<form action="/posts/1/images" method="post" enctype="multipart/form-data">\n    <div>\n        <label for="thumbnail">썸네일 업로드:</label>\n        <!-- accept 속성으로 선택할 수 있는 파일 형식을 이미지로 제한할 수 있습니다. -->\n        <input type="file" id="thumbnail" name="file" accept="image/*">\n    </div>\n    \n    <div>\n        <label for="images">본문 이미지 다중 업로드:</label>\n        <!-- multiple 속성을 주면 사용자가 여러 개의 파일을 동시에 선택할 수 있습니다. -->\n        <input type="file" id="images" name="files" accept="image/*" multiple>\n    </div>\n    \n    <button type="submit">업로드 완료</button>\n</form>',
            language: 'html'
          }
        ]
      },
      {
        id: 'fastapi-part7',
        title: 'Part 7. 실전: 블로그 서비스 확장 기능',
        items: [
          {
            id: 'fastapi-pydantic-settings',
            title: '환경변수 관리 (Pydantic Settings)',
            description: '블로그 운영 환경에서는 DB 주소, JWT 비밀키 등의 민감한 설정값을 코드에 하드코딩해서는 안 됩니다. pydantic-settings 라이브러리를 사용해 .env 파일과 환경변수에서 설정값을 타입-세이프하게 불러옵니다.',
            code: '# pip install pydantic-settings\nfrom pydantic_settings import BaseSettings, SettingsConfigDict\nfrom functools import lru_cache\n\nclass Settings(BaseSettings):\n    project_name: str = "My Awesome Blog"\n    database_url: str\n    secret_key: str\n    access_token_expire_minutes: int = 30\n\n    # .env 파일을 자동으로 읽어오도록 설정합니다.\n    model_config = SettingsConfigDict(env_file=".env")\n\n@lru_cache\ndef get_settings():\n    return Settings()\n\n# 사용 예시 (deps.py 등에서)\n# settings = get_settings()\n# engine = create_engine(settings.database_url)',
            language: 'python'
          },
          {
            id: 'fastapi-background-tasks',
            title: '백그라운드 작업 (Background Tasks)',
            description: '새 포스트가 등록될 때 구독자들에게 이메일 알림을 보내거나, 업로드된 썸네일 이미지를 리사이징하는 작업은 응답을 지연시킬 수 있습니다. BackgroundTasks를 사용하면 HTTP 응답을 먼저 보낸 뒤 작업을 비동기적으로 처리할 수 있습니다.',
            code: 'from fastapi import BackgroundTasks, APIRouter\n\nrouter = APIRouter()\n\ndef send_new_post_email_notification(post_title: str):\n    # 이메일 전송 로직 시뮬레이션 (시간 소요)\n    import time\n    time.sleep(3)\n    print(f"새 글 알림 발송 완료: {post_title}")\n\n@router.post("/posts/")\ndef create_post_with_notification(post: PostCreate, background_tasks: BackgroundTasks, session: Session = Depends(get_session)):\n    # 1. DB에 포스트 저장\n    db_post = Post.model_validate(post)\n    session.add(db_post)\n    session.commit()\n    session.refresh(db_post)\n    \n    # 2. 백그라운드 큐에 알림 작업 추가 (즉시 응답 반환)\n    background_tasks.add_task(send_new_post_email_notification, db_post.title)\n    \n    return db_post',
            language: 'python'
          },
          {
            id: 'fastapi-cors',
            title: 'CORS 미들웨어 적용',
            description: 'FastAPI 백엔드 API를 Jinja2 템플릿 외에도 외부 프론트엔드(React, Vue 등)나 관리자 패널에서 접근하려면 CORS(Cross-Origin Resource Sharing) 설정이 필수적입니다.',
            code: 'from fastapi import FastAPI\nfrom fastapi.middleware.cors import CORSMiddleware\n\napp = FastAPI()\n\n# 접근을 허용할 도메인 목록\norigins = [\n    "http://localhost:3000",   # React 개발 서버\n    "http://admin.myblog.com", # 관리자 패널\n]\n\napp.add_middleware(\n    CORSMiddleware,\n    allow_origins=origins,\n    allow_credentials=True,\n    allow_methods=["*"], # GET, POST, DELETE 등 모든 메서드 허용\n    allow_headers=["*"],\n)',
            language: 'python'
          },
          {
            id: 'fastapi-testing',
            title: 'TestClient를 활용한 API 테스트',
            description: 'FastAPI는 내장된 TestClient를 제공하여 매우 쉽게 API 테스트 코드를 작성할 수 있습니다. pytest와 결합하여 라우터가 정상적으로 작동하는지 검증합니다.',
            code: '# pip install pytest httpx\nfrom fastapi.testclient import TestClient\nfrom app.main import app\n\nclient = TestClient(app)\n\ndef test_read_posts():\n    # 메인 포스트 목록 API 호출\n    response = client.get("/posts/")\n    \n    # 상태 코드와 응답 데이터 검증\n    assert response.status_code == 200\n    assert isinstance(response.json(), list)',
            language: 'python'
          }
        ]
      },
      {
        id: 'fastapi-part8',
        title: 'Part 8. 실전: 배포 및 운영 (Deployment)',
        items: [
          {
            id: 'fastapi-deployment-gunicorn',
            title: 'Gunicorn과 Uvicorn 워커 (Production Server)',
            description: '운영(Production) 환경에서는 단일 Uvicorn 프로세스 대신 Gunicorn을 프로세스 매니저로 사용하고, Uvicorn 워커를 여러 개 띄워 멀티코어 환경의 성능을 극대화합니다.',
            code: '# pip install gunicorn uvicorn\n\n# 터미널에서 다음 명령어로 서버를 실행합니다.\n# -w 4: 4개의 워커 프로세스를 생성합니다. (일반적으로 CPU 코어 수 * 2 + 1)\n# -k uvicorn.workers.UvicornWorker: Uvicorn 워커 클래스를 사용합니다.\n# --bind 0.0.0.0:8000: 모든 외부 IP의 8000번 포트로 수신합니다.\n\ngunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000',
            language: 'bash'
          },
          {
            id: 'fastapi-deployment-dockerfile',
            title: 'Dockerfile 작성',
            description: 'FastAPI 애플리케이션을 Docker 컨테이너로 패키징하기 위한 표준적인 Dockerfile 예시입니다. 컨테이너 내부에서도 uvicorn 혹은 gunicorn을 실행하여 서비스를 제공할 수 있습니다.',
            code: '# 1. 공식 Python 경량 이미지 사용\nFROM python:3.11-slim\n\n# 2. 작업 디렉터리 설정\nWORKDIR /code\n\n# 3. 의존성 파일 복사 및 설치\nCOPY ./requirements.txt /code/requirements.txt\nRUN pip install --no-cache-dir --upgrade -r /code/requirements.txt\n\n# 4. 소스 코드 복사\nCOPY ./app /code/app\n\n# 5. 서버 실행 (컨테이너 환경에서는 uvicorn 단일 프로세스를 사용하고 포트를 노출하거나,\n# 워커가 필요한 경우 gunicorn을 사용합니다.)\nCMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]',
            language: 'dockerfile'
          },
          {
            id: 'fastapi-deployment-compose',
            title: 'Docker Compose로 DB와 함께 배포',
            description: 'FastAPI 서버와 데이터베이스(예: PostgreSQL)를 묶어서 동시에 띄울 때 Docker Compose를 사용합니다. 데이터베이스 연결 주소를 서비스 이름(db)으로 지정하여 간단하게 구성할 수 있습니다.',
            code: 'version: "3.9"\n\nservices:\n  db:\n    image: postgres:15\n    environment:\n      POSTGRES_USER: admin\n      POSTGRES_PASSWORD: password\n      POSTGRES_DB: blogdb\n    ports:\n      - "5432:5432"\n\n  web:\n    build: .\n    ports:\n      - "8000:8000"\n    environment:\n      - DATABASE_URL=postgresql://admin:password@db:5432/blogdb\n    depends_on:\n      - db',
            language: 'yaml'
          }
        ]
      }
    ]
  },
  {
    id: 'alembic',
    title: 'Alembic (Python)',
    categories: [
      {
        id: 'alembic-part1',
        title: 'Part 1. 초급: 설치 및 초기 설정',
        items: [
          {
            id: 'alembic-intro',
            title: 'Alembic이란?',
            description: 'Alembic은 SQLAlchemy 생태계의 데이터베이스 마이그레이션 도구입니다. 코드의 변경사항(컬럼 추가, 테이블 생성 등)을 파이썬 스크립트 형태로 추출/생성하여 "이력(리비전) 관리" 처럼 데이터베이스의 버전을 관리할 수 있게 돕습니다. 마치 코드베이스를 관리하는 Git과 같으며, 데이터베이스 변경 작업을 협업 시 매우 안전하게 동기화하고 적용/롤백 할 수 있는 강력한 기능이 있습니다.'
          },
          {
            id: 'alembic-init',
            title: '설치 및 초기화 (Init)',
            description: 'Alembic을 설치하고 프로젝트에 마이그레이션 적용을 위한 폴더 및 설정 파일을 생성합니다.',
            code: `# pip 설치\npip install alembic\n\n# 현재 디렉토리에 'alembic' 폴더와 'alembic.ini' 환경 설정 파일 생성\nalembic init alembic`,
            language: 'python'
          },
          {
            id: 'alembic-ini',
            title: 'alembic.ini 파일 설정',
            description: '데이터베이스 연결을 위해 alembic.ini 파일에서 sqlalchemy.url을 프로젝트 환경에 맞춰 수정합니다.',
            code: `# alembic.ini 파일 (기본 생성)\n# sqlalchemy.url = driver://user:pass@localhost/dbname\n\n# 👇 실제 연결할 DB URL로 변경합니다. (또는 env.py에서 환경변수 덮어쓰기 권장)\nsqlalchemy.url = postgresql://admin:secret@localhost:5432/mydb`,
            language: 'python'
          },
          {
            id: 'alembic-env',
            title: 'env.py 설정 (모델 인식)',
            description: 'Alembic이 우리가 정의한 테이블 모델의 변경사항을 감지할 수 있도록, 대상 메타데이터(target_metadata)를 연결합니다.',
            code: `# alembic/env.py 파일 수정\n\nfrom logging.config import fileConfig\nfrom sqlalchemy import engine_from_config, pool\nfrom alembic import context\n\n# 1. 사용할 Base(또는 SQLModel)가 정의된 파일 임포트\nfrom app.models import Base \n\n# 2. Alembic이 모델의 변화를 추적할 수 있도록 target_metadata를 설정\ntarget_metadata = Base.metadata\n\n# 나머지 코드는 그대로 유지\n# ...`,
            language: 'python'
          }
        ]
      },
      {
        id: 'alembic-part2',
        title: 'Part 2. 중급: 리비전 생성 및 적용',
        items: [
          {
            id: 'alembic-autogenerate',
            title: '리비전 자동 생성 (Auto Generate)',
            description: 'DB 모델 코드와 실제 DB 상태를 비교하여 변경된 사항을 적용할 파이썬 마이그레이션 스크립트를 만들어냅니다.',
            code: `# 모델 클래스를 수정한 뒤 아래 명령어로 변경사항 스크립트(.py) 추가\n# -m 플래그로 해당 작업의 이름을 붙입니다.\nalembic revision --autogenerate -m "Add email column to users table"\n\n# 성공하면 alembic/versions/ 폴더 내에 임의의 해시값이 붙은 파일이 새로 생성됩니다.`,
            language: 'python'
          },
          {
            id: 'alembic-upgrade',
            title: '데이터베이스 적용 (Upgrade)',
            description: '생성된 최신 마이그레이션 스크립트를 실제로 데이터베이스에 반영하여 구조를 업데이트합니다.',
            code: `# 최신 버전(head)까지 누락된 모든 마이그레이션을 데이터베이스에 반영\nalembic upgrade head\n\n# 특정 리비전(해시) 또는 한 단계만 반영하려면 (+1)\nalembic upgrade +1\nalembic upgrade 8b3c4d5e6f7g`,
            language: 'python'
          },
          {
            id: 'alembic-downgrade',
            title: '이전 상태로 롤백 (Downgrade)',
            description: '구조를 잘못 바꿨거나 오류가 발생했을 때, 이전 리비전의 상태로 되돌리고 싶을 때 역재생(downgrade 함수)을 실행합니다.',
            code: `# 한 단계 안전하게 이전 버전으로 롤백\nalembic downgrade -1\n\n# 특정 단일 리비전(해시) 시점으로 롤백 (해당 시점 이후 적용분이 취소됨)\nalembic downgrade 8b3c4d5e6f7g`,
            language: 'python'
          },
          {
            id: 'alembic-history',
            title: '히스토리 이력 및 상태 추적',
            description: '프로젝트에 누적된 리비전 목록이나, 현재 적용 중인 데이터베이스의 작업 버전을 확인할 수 있습니다.',
            code: `# 모든 마이그레이션 이력(위부터 최신) 나열 및 확인\nalembic history --verbose\n\n# 현재 데이터베이스에 반영되어 적용된 최신 리비전 해시값 확인\nalembic current`,
            language: 'python'
          }
        ]
      },
      {
        id: 'alembic-part3',
        title: 'Part 3. 고급: 수동 조작 및 활용',
        items: [
          {
            id: 'alembic-op-manual',
            title: '수동 마이그레이션 스크립트 작성',
            description: 'autogenerate가 완벽하지 않거나 감지하지 못하는 복잡한 수동 변경(이름 변경, 인덱스 커스텀)을 파일 튜닝으로 처리합니다.',
            code: `from alembic import op\nimport sqlalchemy as sa\n\ndef upgrade():\n    # 테이블 이름 변경\n    op.rename_table('old_users', 'new_users')\n    \n    # 신규 컬럼 생성 (NotNull 속성 추가 등)\n    op.add_column('new_users', sa.Column('is_active', sa.Boolean(), server_default='true'))\n    \n    # 기존 컬럼 타입 변경 (Integers -> String)\n    op.alter_column('new_users', 'age', type_=sa.String(10))\n\ndef downgrade():\n    # 롤백 로직은 항상 upgrade의 완벽한 역순 대응으로 작성되어야 함\n    op.alter_column('new_users', 'age', type_=sa.Integer())\n    op.drop_column('new_users', 'is_active')\n    op.rename_table('new_users', 'old_users')`,
            language: 'python'
          },
          {
            id: 'alembic-data-migration',
            title: '데이터 마이그레이션 병행 (Data Migration)',
            description: '단순 테이블 구조 변경뿐만 아니라, 특정 값들을 일괄 변환하거나 새로운 컬럼에 초기 데이터를 부여하고 싶을 때 사용합니다.',
            code: `from alembic import op\nimport sqlalchemy as sa\n\ndef upgrade():\n    # 1. 새 컬럼을 추가 (nullable 허용상태로 먼저 추가)\n    op.add_column('users', sa.Column('status', sa.String(20)))\n    \n    # 2. op.execute() 로 순수 SQL 실행 -> 기존 데이터들을 일괄 채워넣음\n    op.execute("UPDATE users SET status = 'active' WHERE status IS NULL")\n    \n    # 3. 데이터가 모두 찼으므로, 제약을 더 엄격히(NOT NULL) 변경\n    op.alter_column('users', 'status', nullable=False)\n\ndef downgrade():\n    op.drop_column('users', 'status')`,
            language: 'python'
          },
          {
            id: 'alembic-batch-mode',
            title: '제약 우회 (SQLite Batch Mode)',
            description: 'SQLite는 컬럼 변경이나 삭제(Drop) 지원이 부족합니다. 이를 우회하기 위해 임시 테이블 활용 체계인 Batch 모드를 씁니다.',
            code: `from alembic import op\nimport sqlalchemy as sa\n\ndef upgrade():\n    # SQLite 환경을 염두에 둔다면, 컬럼 삭제는 반드시 batch_alter_table 컨텍스트에서 수행해야 합니다.\n    with op.batch_alter_table('users', schema=None) as batch_op:\n        # 임시 테이블 생성 후 이전 등의 마술로 SQLite의 한계를 극복함\n        batch_op.drop_column('old_column')\n\ndef downgrade():\n    with op.batch_alter_table('users', schema=None) as batch_op:\n        batch_op.add_column(sa.Column('old_column', sa.String(50)))`,
            language: 'python'
          }
        ]
      },
      {
        id: 'alembic-part4',
        title: 'Part 4. FastAPI + SQLModel 연동하기',
        items: [
          {
            id: 'alembic-sqlmodel-env',
            title: 'SQLModel용 env.py 메타데이터 설정',
            description: 'SQLModel을 쓴다면 SQLAlchemy 방식과 조금 다르게 메타데이터를 매핑해야 감지가 정상적으로 이뤄집니다.',
            code: `# alembic/env.py\n\n# 1. SQLModel 임포트 (내부에서 SQLAlchemy 메타데이터를 관리함)\nfrom sqlmodel import SQLModel\n\n# 2. 모델들이 정의된 파일을 필수 임포트해야 스캐너가 감지할 수 있습니다.\nfrom app.models import Hero, Team \n\n# 3. target_metadata 에 SQLModel 내부 메타데이터 자산을 등록\ntarget_metadata = SQLModel.metadata\n\n# 옵션: DB 주소를 환경변수로부터 주입하려면 아래 방식으로 대체\n# import os\n# config.set_main_option("sqlalchemy.url", os.environ.get("DATABASE_URL"))`,
            language: 'python'
          },
          {
            id: 'alembic-sqlmodel-async',
            title: 'FastAPI의 비동기 (Async) Alembic 설정',
            description: '성능 최적화를 위해 비동기 드라이버 (asyncpg 등) 사용 시, alembic 템플릿 명령어와 초기 코드 구성이 다릅니다.',
            code: `# 애초에 alembic 초기 세팅부터 async 템플릿 사용을 권장\nalembic init -t async alembic\n\n#############################################\n# env.py 스크립트 안에 비동기 엔진(async_engine_from_config) 처리가 포함됩니다.\nfrom sqlalchemy.ext.asyncio import async_engine_from_config\n\ndef do_run_migrations(connection):\n    context.configure(connection=connection, target_metadata=target_metadata)\n    with context.begin_transaction():\n        context.run_migrations()\n\nasync def run_async_migrations():\n    connectable = async_engine_from_config(config.get_section(config.config_ini_section, {}))\n    async with connectable.connect() as connection:\n        await connection.run_sync(do_run_migrations)\n#############################################`,
            language: 'python'
          },
          {
            id: 'alembic-sqlmodel-types',
            title: 'SQLModel 타입 및 디폴트 값 감지 옵션',
            description: 'SQLModel(또는 SQLAlchemy)에서 컬럼 타입 교체나 server_default 등의 변동을 추적하려면 추가 옵션을 활성화해야 합니다.',
            code: `# alembic/env.py 의 context.configure(...) 인스턴스를 찾습니다.\n\ndef run_migrations_online():\n    context.configure(\n        connection=connection,\n        target_metadata=target_metadata,\n        compare_type=True,          # (중요) 기존 컬럼 데이터 타입 변경을 감지\n        compare_server_default=True # (중요) DB단 디폴트 값 변경 감지\n    )\n    \n    with context.begin_transaction():\n        context.run_migrations()`,
            language: 'python'
          }
        ]
      }
    ]
  },
  {
    id: 'jinja2',
    title: 'Jinja2 템플릿 엔진',
    categories: [
      {
        id: 'jinja2-part1',
        title: 'Part 1. 템플릿 상속 및 기본 문법',
        items: [
          {
            id: 'jinja2-extends',
            title: '템플릿 상속 (Template Inheritance)',
            description: '블로그의 공통 레이아웃(헤더, 푸터, 사이드바 등)을 유지하기 위해 base.html을 만들고 다른 페이지들이 이를 상속(extends)받아 특정 블록(block)만 재정의합니다.',
            code: '<!-- app/templates/base.html -->\n<!DOCTYPE html>\n<html lang="ko">\n<head>\n    <title>{% block title %}My Blog{% endblock %}</title>\n    <link rel="stylesheet" href="{{ url_for(\'static\', path=\'style.css\') }}">\n</head>\n<body>\n    <header>\n        <h1><a href="{{ url_for(\'render_home\') }}">My Awesome Blog</a></h1>\n    </header>\n    \n    <main>\n        <!-- 자식 템플릿이 내용을 채울 영역 -->\n        {% block content %}{% endblock %}\n    </main>\n    \n    <footer>\n        <p>&copy; 2026 My Blog</p>\n    </footer>\n</body>\n</html>',
            language: 'html'
          },
          {
            id: 'jinja2-variables',
            title: '변수 출력 및 필터 (Variables & Filters)',
            description: '이중 중괄호 {{ }}를 사용하여 서버에서 전달된 변수(SQLModel 객체 등)를 출력합니다. 파이프(|)를 이용해 필터를 적용하여 데이터를 포맷팅하거나 이스케이프를 방지할 수 있습니다.',
            code: '<!-- app/templates/post_detail.html -->\n{% extends "base.html" %}\n\n{% block title %}{{ post.title }} - My Blog{% endblock %}\n\n{% block content %}\n    <article>\n        <h2>{{ post.title }}</h2>\n        <p class="meta">작성자: {{ post.author.username | default("익명") }} | 작성일: {{ post.created_at.strftime("%Y-%m-%d %H:%M") }}</p>\n        \n        <div class="content">\n            <!-- HTML 태그가 포함된 본문을 그대로 렌더링하려면 safe 필터 사용 -->\n            {{ post.content | safe }}\n        </div>\n    </article>\n{% endblock %}',
            language: 'html'
          }
        ]
      },
      {
        id: 'jinja2-part2',
        title: 'Part 2. 제어 흐름 (Control Structures)',
        items: [
          {
            id: 'jinja2-for-loop',
            title: '반복문 (For Loops)',
            description: '{% for %} 구문을 사용하여 데이터베이스에서 조회한 포스트 목록을 순회하며 렌더링합니다. 반복문 내에서 loop 객체를 사용하여 현재 인덱스 등을 확인할 수 있습니다.',
            code: '<!-- app/templates/index.html -->\n{% extends "base.html" %}\n\n{% block content %}\n    <h2>최신 글 목록</h2>\n    <ul class="post-list">\n        {% for post in posts %}\n            <li>\n                <a href="/posts/{{ post.id }}">{{ post.title }}</a>\n                {% if loop.first %}\n                    <span class="badge">New!</span>\n                {% endif %}\n            </li>\n        {% else %}\n            <!-- posts 리스트가 비어있을 때 실행됩니다. -->\n            <li>현재 등록된 글이 없습니다. 첫 글을 작성해보세요!</li>\n        {% endfor %}\n    </ul>\n{% endblock %}',
            language: 'html'
          },
          {
            id: 'jinja2-if-else',
            title: '조건문 (If / Elif / Else)',
            description: '{% if %} 구문을 사용하여 조건에 따라 다른 HTML을 렌더링합니다. 로그인 여부에 따라 글쓰기 버튼을 보이거나 숨길 때 유용합니다.',
            code: '{% if request.state.user %}\n    <div class="user-menu">\n        <p>환영합니다, {{ request.state.user.username }}님!</p>\n        <a href="{{ url_for(\'create_post_form\') }}" class="btn">새 글 작성</a>\n        <a href="/logout" class="btn">로그아웃</a>\n    </div>\n{% else %}\n    <div class="guest-menu">\n        <a href="/login" class="btn">로그인</a>\n        <a href="/signup" class="btn">회원가입</a>\n    </div>\n{% endif %}',
            language: 'html'
          }
        ]
      },
      {
        id: 'jinja2-part3',
        title: 'Part 3. 폼 처리 및 컴포넌트 재사용',
        items: [
          {
            id: 'jinja2-forms',
            title: 'HTML Form 및 FastAPI 라우팅 결합',
            description: '새로운 블로그 포스트를 작성하는 폼입니다. 폼의 action과 FastAPI의 엔드포인트를 연결하고, 에러 메시지가 있을 경우 출력하도록 구성합니다.',
            code: '<!-- app/templates/create_post.html -->\n{% extends "base.html" %}\n\n{% block content %}\n    <h2>새 포스트 작성</h2>\n    \n    {% if error_message %}\n        <div class="alert alert-danger">{{ error_message }}</div>\n    {% endif %}\n\n    <!-- 파일(썸네일 등)을 함께 업로드하려면 enctype="multipart/form-data" 필수 -->\n    <form action="/posts/" method="post" enctype="multipart/form-data">\n        <div class="form-group">\n            <label for="title">제목</label>\n            <input type="text" id="title" name="title" required value="{{ form_data.title | default(\'\') }}">\n        </div>\n        \n        <div class="form-group">\n            <label for="content">본문</label>\n            <textarea id="content" name="content" rows="10" required>{{ form_data.content | default(\'\') }}</textarea>\n        </div>\n        \n        <div class="form-group">\n            <label for="thumbnail">썸네일 이미지</label>\n            <input type="file" id="thumbnail" name="thumbnail" accept="image/*">\n        </div>\n        \n        <button type="submit" class="btn btn-primary">저장하기</button>\n    </form>\n{% endblock %}',
            language: 'html'
          },
          {
            id: 'jinja2-macros',
            title: '매크로 (Macros) - 재사용 가능한 컴포넌트',
            description: '블로그의 포스트 카드(Post Card)나 페이지네이션 버튼처럼 여러 템플릿에서 반복적으로 사용되는 UI 요소를 매크로로 정의하여 재사용합니다.',
            code: '<!-- app/templates/macros/post_card.html -->\n{% macro render_post_card(post) %}\n    <div class="post-card">\n        {% if post.thumbnail %}\n            <img src="{{ post.thumbnail }}" alt="{{ post.title }} 썸네일">\n        {% else %}\n            <img src="/static/images/default-thumb.png" alt="기본 썸네일">\n        {% endif %}\n        \n        <div class="post-card-content">\n            <h3><a href="/posts/{{ post.id }}">{{ post.title }}</a></h3>\n            <p class="summary">{{ post.content[:80] }}...</p>\n            <small>{{ post.author.username }} | {{ post.created_at.strftime("%Y-%m-%d") }}</small>\n        </div>\n    </div>\n{% endmacro %}\n\n<!-- 다른 템플릿에서 불러와서 사용하기 -->\n<!-- \n{% from "macros/post_card.html" import render_post_card %}\n\n<div class="grid">\n    {% for post in posts %}\n        {{ render_post_card(post) }}\n    {% endfor %}\n</div>\n-->',
            language: 'html'
          }
        ]
      }
    ]
  }
];

const desiredOrder = ['fastapi', 'sqlmodel', 'alembic', 'sql', 'sqlalchemy', 'jinja2'];
export const navData = _navData.sort((a, b) => {
  const indexA = desiredOrder.indexOf(a.id);
  const indexB = desiredOrder.indexOf(b.id);
  if (indexA === -1) return 1;
  if (indexB === -1) return -1;
  return indexA - indexB;
});
