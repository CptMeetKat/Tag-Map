using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MvcTag.Models;

    public class MvcTagContext : DbContext
    {
        public MvcTagContext (DbContextOptions<MvcTagContext> options)
            : base(options)
        {
        }

        public DbSet<MvcTag.Models.Tag> Tag { get; set; } = default!;
    }
