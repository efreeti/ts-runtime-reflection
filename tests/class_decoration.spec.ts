import {
    Reflective,
    Types,
    getType,
    getPropType,
    getSubclasses
} from '../src';

const TypeKind = Types.TypeKind;


@Reflective
class TestClass extends Array<string> {
    'str': string
    'str-str': string
    42: string
    get computed() {
        return 'string'
    }
    [Symbol.toPrimitive](){
        return 23
    }
    method() {
        return 'asd'
    }
    constructor(
        public publicShorthandProp: string,
        private privateShorthandProp: number,
        protected protectedShorthandProp: boolean,
        readonly readonlyShorthandProp: Date
    ) {
      super();
    }
}

@Reflective
class ParentClass {}

@Reflective
class Subclass1 extends ParentClass {}

@Reflective
class Subclass2 extends ParentClass {}

describe('Class decoration', () => {
   it('should decorate null properties', () => {
      const ptype = getType(TestClass) as Types.ClassType
      expect(ptype.kind).toEqual(TypeKind.Class)
      expect(ptype.name).toEqual('TestClass')
      expect(ptype.extends).toEqual({kind: TypeKind.Reference, type: Array, arguments: [{kind: TypeKind.String} as any]})

      expect(ptype.props).toEqual([
          'str', 'str-str', 42, 'publicShorthandProp', 'privateShorthandProp', 'protectedShorthandProp', 'readonlyShorthandProp'
      ])

      expect(getPropType(TestClass, 'str')).toEqual({kind: TypeKind.String})
      expect(getPropType(TestClass, 'str-str')).toEqual({kind: TypeKind.String})
      expect(getPropType(TestClass, 42)).toEqual({kind: TypeKind.String})
      expect(getPropType(TestClass, 'publicShorthandProp')).toEqual({kind: TypeKind.String})
      expect(getPropType(TestClass, 'privateShorthandProp')).toEqual({kind: TypeKind.Number})
      expect(getPropType(TestClass, 'protectedShorthandProp')).toEqual({kind: TypeKind.Boolean})
      expect(getPropType(TestClass, 'readonlyShorthandProp')).toEqual({kind: TypeKind.Reference, type: Date, arguments: []})
   });
});

describe('Sub classes registration', () => {
   it('should register all subclasses', () => {
      const subclasses = getSubclasses(ParentClass)!
      expect(subclasses.length).toEqual(2)
      expect(subclasses[0]).toEqual(Subclass1)
      expect(subclasses[1]).toEqual(Subclass2)
   });
});

